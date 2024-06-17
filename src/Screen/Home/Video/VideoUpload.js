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
const VideoUpload = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [token, setToken] = useState("");
    const [connectionType, setConnectionType] = useState("unknown");
    const MAX_SIMULTANEOUS_UPLOADS = Math.min(50, connectionType === 'cellular' ? 5 : 7);
    const CHUNK_SIZE = Math.min(10 * 1024 * 1024, connectionType === 'cellular' ? 5 * 1024 * 1024 : 10 * 1024 * 1024);
    const apiClient = axios.create({ baseURL: 'https://upload.lykstage.com:9092', headers: { "Content-Type": "application/json" } });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => { setConnectionType(state.type); });
        return () => { unsubscribe(); };
    }, []);

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


    const fetchToken = async () => {
        console.log("in the fetchtoken function")
        try {
            const result = await apiClient.post("/noauth/tkn", { userId: "12345" });
            const accessToken = result.data.response.access_token;
            console.log(" accessToken===================== ", accessToken);
            setToken(accessToken);
            apiClient.defaults.headers.Authorization = "Bearer " + accessToken;
            return accessToken;
        } catch (error) { console.error('Error fetching token:', error); }
    };

    const getfileToken = async (fName, fileType, fileSize, totalChunks) => {
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
        const initResp = await response.json();
        const fileToken = initResp.response.fileToken;
        return fileToken;
    }


    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

    const uploadFile = async () => {
        if (!token) {
            await fetchToken();
        }
        if (!file) {
            showErrorAlert('Please select a file.');
            return;
        }
        else {
            await uploadFileBackgroundTask(file, connectionType, MAX_SIMULTANEOUS_UPLOADS, CHUNK_SIZE)
        }
    };




    const uploadFileBackgroundTask = async (file) => {
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        console.log("file is >> ", file);
        console.log("TotalChunks >> ", totalChunks)

        try {
            let fileToken = await getfileToken(file.name, file.type, file.size, totalChunks);
            console.log("FileToken is >>>> ", fileToken)
            const chunkQueue = [];
            for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
                console.log("Creating chunk....")
                const start = (partNumber - 1) * CHUNK_SIZE;
                const end = Math.min(partNumber * CHUNK_SIZE, fileSize);
                chunkQueue.push({ partNumber, start, end });
            }

        }
        catch (e) {
            console.warn("Error happend---> ", e)
        }







    }







    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, marginTop: normalize(40) }}>
            {/* <Button title="Fetch Token" onPress={fetchToken} /> */}


            <View style={{ marginVertical: 10 }} />

            <Button title="Select Video" onPress={selectFile} />
            <View style={{ marginVertical: 10 }} />
            <Button title="Upload File" onPress={uploadFile} />
            <View style={{ marginVertical: 10 }} />

            {/* <Text>Progress: {progress}%</Text> */}
        </View>
    )
}

export default VideoUpload