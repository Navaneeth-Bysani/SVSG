import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert } from "react-native";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "../utils/axios";
import Loader from "../components/Loader";

const AddClientScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ name, setName] = useState("");
    

    const handleSubmit = () => {
        const client = {
            name
        };
        axios.post("/client", client , {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            },
        }).then((data) => {
            Alert.alert(`Client ${data.data.createdClient.name} has been created`);

            navigation.navigate("dashboard");
        }).catch(error => {
            console.error(error);
            Alert.alert("something went wrong");
        })
    }
     
    return (
        <ScrollView>
        <View style={stylesText.container}>
            <Loader loading={loading}/>
            {/* <ScrollView> */}
                <Text>Name</Text>
                <TextInput  placeholder="Enter Client Name" onChangeText={setName} style={styles.inputStyle}/>

                <Button
                    title = "Add Client"
                    onPress={handleSubmit}>
                        Add Client
                </Button>

            {/* </ScrollView> */}
            
        </View>
        </ScrollView>
    )
}

const stylesText = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center' }
});

export default AddClientScreen;