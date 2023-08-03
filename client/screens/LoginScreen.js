import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import styles from "./Login.module.css";
import AuthButton from "./../components/AuthButton.js";

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            {/* <Text>I am Login Screen</Text> */}
            <View style={styles.logoContainer}>
                <Image source={require("./../assets/logo.png")}  />
            </View>
            <View>
                {/* <Image source={require("./../assets/icon.png")}/> */}
                <View style={styles.button}>
                    <AuthButton />
                </View>

            </View>
        </View>
    )
}

export default LoginScreen;