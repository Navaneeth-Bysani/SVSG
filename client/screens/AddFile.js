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
    const [repeated_barcodes_info, set_repeated_barcodes_info] = useState("");
    
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

    const postDocument = async () => {
        const url = "/cylinder/excel/upload";
        const fileUri = doc.uri;
        const formData = new FormData();
        formData.append('document', doc);
        
        try {
            const data = await axios.post(url, formData, {
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${authToken}`,
                  }
            });
            Alert.alert("uploaded successfully");
        } catch (error) {
            console.error(error);
            Alert.alert(error);
        }
        // axios.post(url, formData, {
        //     headers: {
        //         "Accept": 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //         "Authorization": `Bearer ${authToken}`,
        //       }
        // }).then(data => {
        //     Alert.alert(data);
        //     const repeated_barcodes = data.repeated_barcodes;
        //     // if(repeated_barcodes.length !== 0) {
        //     //     set_repeated_barcodes_info(`Repeated barcodes:\n${repeated_barcodes.join(",")}`);
        //     // }
        //     Alert.alert("Cylinders created successfully");
        // }).catch(err => {
        //     console.error(err);
        //     Alert.alert(JSON.stringify(err));
        // });
    }


    return (        
        <View>
            <Button title="Select Document" onPress={pickDocument} />
            <Text>{`${doc?.name}\n${doc?.size} bytes\n${doc?.uri}\n${doc?.type}`}</Text>
            <Button title="Upload" onPress={postDocument} />

            <Text>
                {repeated_barcodes_info}
            </Text>
        </View>
    )

}


export default DocPicker;