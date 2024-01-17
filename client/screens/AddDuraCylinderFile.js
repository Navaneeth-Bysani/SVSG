import React, { useState } from 'react';
import { Button, View, Alert, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";
import Loader from '../components/Loader';

const DuraDocPicker = ({navigation}) => {
    const [ doc, setDoc ] = useState();
    // const [file, setFile] = useState({});

    const { authToken } = useAuthContext();
    const [repeated_barcodes_info, set_repeated_barcodes_info] = useState("");
    const [repeated_barcodes_num, set_repeated_barcodes_num] = useState(0);
    

    const [loading, setLoading] = useState(false);

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
        const url = "/duracylinder/excel/upload";
        const fileUri = doc.uri;
        const formData = new FormData();
        formData.append('document', doc);
        
        try {
            setLoading(true);
            const data = await axios.post(url, formData, {
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${authToken}`,
                  }
            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
            setLoading(false);

            set_repeated_barcodes_info(data.data.repeated_barcodes_message);
            set_repeated_barcodes_num(data.data.repeated_barcodes_num);
            if(data.data.repeated_barcodes_num === 0) {
                Alert.alert("uploaded successfully");
                setDoc(null);
                navigation.navigate("dashboard");
            } else {
                Alert.alert("Few barcodes repeated");
            }
        } catch (error) {
            console.error(error);
            Alert.alert(error);
            setLoading(false);
        }
    }

    const handleLinkPress = () => {
        // Define the URL you want to open
        const url = 'https://docs.google.com/spreadsheets/d/1uKjU0mJ8_Z7MWHyP2-JA9x05b_mB_38kbGN7jXaK97I/edit?usp=sharing';
    
        // Open the URL using the Linking module
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };
    
    return (        
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Loader loading={loading} />
                    <Text style={styles.heading1}>Download the excel template</Text>
                    <Text>Download the excel template to fill data from below link.</Text>
                    <Text style={styles.link} onPress={handleLinkPress}>
                        Click here to download
                    </Text>
                </View>
                <View style={styles.uploadSection}>
                    <Button title="Select Document" onPress={pickDocument} />
                </View>

                <Text>{`File name: ${doc ? doc.name : ""}`}</Text>
                <Text>{`File size: ${doc ? doc.size : "0"} bytes`}</Text>
                <Text>{`File path: ${doc ? doc.uri : ""}`}</Text>
                <Text>{`File type: ${doc ? doc.type : ""}`}</Text>
                <Button title="Upload" onPress={postDocument} disabled={doc ? false : true}/>

                <Text>
                    {repeated_barcodes_info.length != "" ? `Repeated barcodes. ${repeated_barcodes_num}\n` : ""}
                    {repeated_barcodes_info}
                </Text>
            </ScrollView>
            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },

    heading1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    },

    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },

    uploadSection: {
        marginTop: 10
    }
})


export default DuraDocPicker;