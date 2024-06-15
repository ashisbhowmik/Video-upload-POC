import React, { useState } from 'react';
import { View, Button, Alert, Text, ProgressBarAndroid } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import showErrorAlert from '../../../Utils/Helpers/Toast';
import normalize from '../../../Utils/Helpers/Dimen';
import connectionrequest from '../../../Utils/Helpers/NetInfo';
import { signupRequest } from '../../../Redux/Reducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';


import RNFS from 'react-native-fs';
const Videoupload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileToken, setFileToken] = useState("");
  const [parts, setParts] = useState([]);
  const [token, setToken] = useState("");
  // const dispatch = useDispatch();
  // const AuthReducer = useSelector(state => state.AuthReducer);

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
      console.log("res---> ", res)
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        Alert.alert('Error', 'Failed to pick a file');
      }
    }
  };

  const uploadFile = async () => {
    if (!file) {
      showErrorAlert('Please select a file.');
      return;
    }

    const chunkSize = 5 * 1024 * 1024; // 5 MB
    const fName = file.name;
    const fileSize = file.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);
    const fileType = 'video/mp4';
    console.log(totalChunks, "totalChunks====================", chunkSize);
    console.log(fName, "fileName====================", fileSize);

    try {
      if (!token) {
        await fetchToken();
      }

      console.log("Token:", token);
      console.log("Initiating upload with:", {
        fileName: fName,
        fileType: fileType,
        size: fileSize,
        totalChunks: totalChunks
      });

      const response = await fetch('https://upload.lykstage.com:9092/mob/initUp', {
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
      const fileToken = initResp.response.fileToken;
      console.log(fileToken, "fileToken===========================");
      setFileToken(fileToken);
      const partsArray = [];
      const filePath = file.uri;

      for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
        const start = (partNumber - 1) * chunkSize;
        const end = Math.min(partNumber * chunkSize, fileSize);

        const partData = await RNFS.read(filePath, chunkSize, start, 'base64');

        console.log(partData, "partData===========================")
        // const presignedUrlResponse = await apiClient.post('/mob/getUpUrl', {
        //   fileToken: fileToken,
        //   partNumber: partNumber
        // });
        const presignedUrlResponse = await fetch('https://upload.lykstage.com:9092/mob/getUpUrl', {
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
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to initiate upload:', errorText);
          throw new Error('Failed to initiate upload');
        }
        const preResp = await presignedUrlResponse.json();
        console.log(preResp, "fileToken===========================");
        // const fileToken = preResp?.response?.url;
        console.log(preResp?.response?.url, "url========================");
        // console.log(presignedUrlResponse,"presignedUrlResponse")
        // const preResp = presignedUrlResponse?.data;
        // const uploadUrl = preResp?.response?.url;
        //  console.log(uploadUrl,"uploadUrl===============================")

        // const uploadResponse = await axios.put(preResp?.response?.url, partData, {
        //   headers: {
        //     'Content-Type': 'application/octet-stream'
        //   }
        // });
        const uploadResponse = await RNFetchBlob.fetch('PUT', preResp?.response?.url, {
          'Content-Type': 'application/octet-stream',
        }, partData);
        const eTag = uploadResponse?.respInfo?.headers?.ETag;
        console.log(eTag, "ETag");
        if (eTag) {
          partsArray.push({ ETag: eTag, PartNumber: partNumber });
          const progress = (partNumber / totalChunks * 100).toFixed(2);
          setProgress(progress);
        } else {
          showErrorAlert('Part upload failed.');
          return;
        }
      }
      setParts(partsArray);
      console.log(partsArray, "partsaryy========================")
      const completeResponse = await fetch('https://upload.lykstage.com:9092/mob/finishUp', {
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
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to initiate upload:', errorText);
        throw new Error('Failed to initiate upload');
      }
      const preResp_Complte = await completeResponse.json();
      console.log(preResp_Complte, "completeResponse===========================");
      // const completeResponse = await apiClient.post('/mob/finishUp', {
      //   fileToken: fileToken,
      //   parts: partsArray
      // });
      // console.log()
      if (preResp_Complte?.message == "ok") {
        showErrorAlert("File uploaded successfully!");
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorAlert('An error occurred');
    }
  };




  const uploadFile_Ashis = async (inputRef) => {
    try {
      console.log("file  is ---> ,uploading ... ", file)
      const upload = UpChunk.createUpload({
        endpoint: 'https://uploader.lykstage.com/files', // Authenticated url
        file: file, // File object with your video file’s properties
        chunkSize: 30720, // Uploads the file in ~30 MB chunks
      });

      // Subscribe to events
      upload.on('error', (error) => {
        console.log("error happend during upload --- > ", error)
      });
      upload.on('progress', (progress) => {
        console.log("Progress is ---> ", progress)
      });
      upload.on('success', (data) => {
        console.log("Wrap it up, we're done here. 👋", data);
      });
    } catch (error) {
      console.log("in catch block ---> ", error)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 10, marginTop: normalize(40) }}>
      <Button title="Fetch Token" onPress={fetchToken} />
      <Button title="Select Video" onPress={selectFile} />
      <Button title="Upload File" onPress={uploadFile} />

      <Text>Progress: {progress}%</Text>
      {progress > 0 && progress < 100 && <ProgressBarAndroid styleAttr="Horizontal" progress={progress / 100} />}
    </View>
  );
};

export default Videoupload; 