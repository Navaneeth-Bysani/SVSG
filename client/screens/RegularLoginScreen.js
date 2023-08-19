import { View, Text, StyleSheet, Image, ImageBackground, TextInput, Button, Alert } from "react-native";
import styles from "./Login.module.css";
import AuthButton from "./../components/AuthButton.js";
import useAuthContext from "../hooks/useAuthContext";
import {useState} from "react";
import axios from "./../utils/axios";

const RegularLoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, authToken, user } = useAuthContext();

    
    // if(user && authToken) {
    //     navigation.navigate("Home");
    // }
    const handleLogin =  async () => {
        try {
            const loginResponse = await axios.post("/auth/regular-login", {
                email, password
            });
            const data = loginResponse.data.user;
            const authToken = loginResponse.data.jwt;

            login(data, authToken);
            
            // if(userContext && authTokenContext){
            //     navigation.navigate("dashboard")
            // }

        } catch (error) {
            Alert.alert("Something went wrong");
            console.error(error);
        }
    }
    return (
        <View style={styles.container}>
            <Text>Enter your email address</Text>
            <TextInput 
                    placeholder="enter email"
                    value = {email}
                    onChangeText = {setEmail}
                />

                <Text>Enter your password:</Text>
                <TextInput 
                    secureTextEntry = {true}
                    placeholder="enter password"
                    value = {password}
                    onChangeText={setPassword}
                />

                <Button
                    title = "Login"
                    onPress={handleLogin}>
                        Submit
                </Button>

                <Text>{authToken}</Text>
                <Text>{JSON.stringify(user)}</Text>
        </View>
    )
}

export default RegularLoginScreen;