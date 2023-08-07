import React, { useState } from 'react';
import { Button, View, Alert, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";

const DocPicker = () => {
    const [ doc, setDoc ] = useState();
    // const [file, setFile] = useState({});

    const { authToken } = useAuthContext();
    
    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], copyToCacheDirectory: true }).then(response => {
                if (response.type == 'success') {
                    let { name, size, uri } = response;
                    // setFile({name, size, uri});
                    let nameParts = name.split('.');
                    let fileType = nameParts[nameParts.length - 1];
                    var fileToUpload = {
                        name: name,
                        size: size,
                        uri: uri,
                        type: "application/" + fileType
                    };
                    console.log(fileToUpload, '...............file')
                    setDoc(fileToUpload);
                } 
              });
        } catch (error) {
            console.error(error);
        }
    }

    const postDocument = () => {
        const url = "/material/excel/upload";
        const fileUri = doc.uri;
        const formData = new FormData();
        formData.append('document', doc);
        Alert.alert("uploading?");
        axios.post(url, formData, {
            headers: {
                "Accept": 'application/json',
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${authToken}`,
              }
        }).catch(err => console.error(err));
    }


    return (        
        <View>
            <Button title="Select Document" onPress={pickDocument} />
            <Text>{`${doc?.name}\n${doc?.size} bytes\n${doc?.uri}\n${doc?.type}`}</Text>
            <Button title="Upload" onPress={postDocument} />
        </View>
    )

}


export default DocPicker;