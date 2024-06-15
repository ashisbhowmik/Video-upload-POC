import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, ProgressBarAndroid } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import showErrorAlert from '../../../Utils/Helpers/Toast';
import normalize from '../../../Utils/Helpers/Dimen';
import RNFS from 'react-native-fs';
import NetInfo from "@react-native-community/netinfo";
import BackgroundService from 'react-native-background-actions';
import { useLinkTo } from '@react-navigation/native'; // For deep linking
import * as UpChunk from '@mux/upchunk';

const AddTraining = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileToken, setFileToken] = useState("");
  const [parts, setParts] = useState([]);
  const [token, setToken] = useState("");
  const [connectionType, setConnectionType] = useState("unknown"); // Default connection type
  const linkTo = useLinkTo(); // Hook for navigating via linking

  // Fetch network connection type on component mount
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const MAX_SIMULTANEOUS_UPLOADS = Math.min(50, connectionType === 'cellular' ? 5 : 7);
  const CHUNK_SIZE = Math.min(10 * 1024 * 1024, connectionType === 'cellular' ? 5 * 1024 * 1024 : 10 * 1024 * 1024);

  const apiClient = axios.create({
    baseURL: 'https://upload.lykstage.com:9092',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const fetchToken = async () => {
    try {
      const result = await apiClient.post("/noauth/tkn", { userId: "40672" });
      const accessToken = result.data.response.access_token;
      console.log(accessToken, "accessToken=====================");
      setToken(accessToken);
      apiClient.defaults.headers.Authorization = "Bearer " + accessToken;
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [types.video],
      });
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        Alert.alert('Error', 'Failed to pick a file');
      }
    }
  };

  // Sleep function for delay
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Background task for uploading video chunks
  const uploadFileBackgroundTask = async (taskDataArguments) => {
    console.log("In the upload background function")

    const { file, token, connectionType, MAX_SIMULTANEOUS_UPLOADS, CHUNK_SIZE } = taskDataArguments;

    console.log("file is >> ", file);
    console.log("token is >> ", token);
    console.log("chunk size >> ", CHUNK_SIZE);
    console.log("MAX_SIMULTANEOUS_UPLOADS size >> ", MAX_SIMULTANEOUS_UPLOADS);


    const fName = file.name;
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
    const fileType = 'video/mp4';

    try {
      const response = await fetch('https://upload.lykstage.com:9092/mob/inUp', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: fName,
          fileType: fileType,
          size: fileSize,
          totalChunks: totalChunks
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to initiate upload:', errorText);
        throw new Error('Failed to initiate upload');
      }

      const initResp = await response.json();
      console.log("mob/inUp response -----> ", initResp.response)
      const fileToken = initResp.response.fileToken;
      const partsArray = [];
      const filePath = file.uri;

      const uploadChunk = async (partNumber, start, end, retries = 3) => {
        console.log("in the uploadChunk --> ", partNumber, " ", start, " ", end)
        try {
          const partData = await RNFS.read(filePath, end - start, start, 'base64');
          const presignedUrlResponse = await fetch('https://upload.lykstage.com:9092/mob/gtUp', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              fileToken: fileToken,
              partNumber: partNumber
            })
          });

          if (!presignedUrlResponse.ok) {
            const errorText = await presignedUrlResponse.text();
            console.error('Failed to get presigned URL:', errorText);
            throw new Error('Failed to get presigned URL');
          }

          const preResp = await presignedUrlResponse.json();
          console.log("presignedUrlResponse for partNumber : ", partNumber, " is  : ", preResp?.response?.url)
          const uploadResponse = await RNFetchBlob.fetch('PUT', preResp?.response?.url, {
            'Content-Type': 'application/octet-stream',
          }, partData);
          console.log("uploadResponse >>>>>> ", uploadResponse.respInfo.headers.ETag)
          const eTag = uploadResponse?.respInfo?.headers?.ETag;
          if (eTag) {
            partsArray.push({ ETag: eTag, PartNumber: partNumber });
            const progress = (partsArray.length / totalChunks * 100).toFixed(2);
            setProgress(progress);
          } else {
            showErrorAlert('Part upload failed.');
            throw new Error('Part upload failed');
          }
        } catch (error) {
          if (retries > 0) {
            console.warn(`Retrying chunk ${partNumber}... (${retries} retries left)`);
            await sleep(2000); // Adding sleep to avoid immediate retries
            await uploadChunk(partNumber, start, end, retries - 1);
          } else {
            throw error;
          }
        }
      };

      const uploadChunksConcurrently = async () => {
        const chunkQueue = [];
        for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
          const start = (partNumber - 1) * CHUNK_SIZE;
          const end = Math.min(partNumber * CHUNK_SIZE, fileSize);
          chunkQueue.push({ partNumber, start, end });
        }
        console.log("chunkQueue is >>> ", chunkQueue)
        const uploadPromises = [];
        const uploadNextChunk = async () => {
          console.log("pushing the funciton in the uploadPromisses")
          if (chunkQueue.length === 0) return;
          const { partNumber, start, end } = chunkQueue.shift();
          uploadPromises.push(uploadChunk(partNumber, start, end));
          uploadNextChunk();
        };
        uploadNextChunk();
        console.log("On the phase of executing the promisses")
        await Promise.all(uploadPromises);
        console.log("Execution completed of alll the promisses")
      };

      await uploadChunksConcurrently();
      partsArray.sort((a, b) => a.PartNumber - b.PartNumber);

      const completeResponse = await fetch('https://upload.lykstage.com:9092/mob/fnUp', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fileToken: fileToken,
          parts: partsArray
        })
      });

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text();
        console.error('Failed to complete upload:', errorText);
        throw new Error('Failed to complete upload');
      }

      const preResp_Complete = await completeResponse.json();
      if (preResp_Complete?.message === "ok") {
        showErrorAlert("File uploaded successfully!");
      }
    } catch (error) {
      console.error('Error in background task:', error);
      showErrorAlert('An error occurred during background upload');
    }
  };

  const uploadFile = async () => {
    if (!file) {
      showErrorAlert('Please select a file.');
      return;
    }

    if (!token) {
      await fetchToken();
    }

    const options = {
      taskName: 'VideoUpload',
      taskTitle: 'Uploading Video',
      taskDesc: 'Your video is being uploaded in the background',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      parameters: {
        file: file,
        token: token,
        connectionType: connectionType,
        MAX_SIMULTANEOUS_UPLOADS: MAX_SIMULTANEOUS_UPLOADS,
        CHUNK_SIZE: CHUNK_SIZE
      },
      linkingURI: 'myapp://upload', // Replace with your app's deep link scheme
      delay: 2000, // Delay between chunk uploads to reduce crash likelihood
    };

    await BackgroundService.start(uploadFileBackgroundTask, options);
  };

  const uploadFile_Ashis = async (inputRef) => {

  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 10, marginTop: normalize(40) }}>
      {/* <Button title="Fetch Token" onPress={fetchToken} /> */}



      <View style={{ marginVertical: 10 }} />

      <Button title="Select Video" onPress={selectFile} />
      <View style={{ marginVertical: 10 }} />
      <Button title="Upload File" onPress={uploadFile} />
      <View style={{ marginVertical: 10 }} />

      <Text>Progress: {progress}%</Text>
    </View>
  );
};

export default AddTraining;
