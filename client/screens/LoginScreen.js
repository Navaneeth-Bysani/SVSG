import { View, Text, StyleSheet, Image, ImageBackground, Pressable } from "react-native";
import styles from "./Login.module.css";
import AuthButton from "./../components/AuthButton.js";
import { useEffect } from "react";
import axios from "../utils/axios";

const LoginScreen = ({navigation}) => {
    useEffect(() => {
        axios.get("/").then((data) => {}).catch(err => console.error(err));
    }, [])
    return (
        <View style={styles.container}>
            {/* <Text>I am Login Screen</Text> */}
            <View style={styles.logoContainer}>
                <Image source={require("./../assets/logo.jpg")}  />
            </View>
            <View>
                {/* <Image source={require("./../assets/icon.png")}/> */}
                <View style={styles.button}>
                    {/* <AuthButton /> */}
                    <Pressable onPress={() => navigation.navigate("regularLogin")}>
                        <Text>Login with email and password</Text>
                    </Pressable>
                </View>

                <View style = {styles.AuthButton}>
                    
                </View>
            </View>
        </View>
    )
}

export default LoginScreen;