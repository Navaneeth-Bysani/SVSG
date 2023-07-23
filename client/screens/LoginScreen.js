import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import styles from "./Login.module.css";
import AuthButton from "./../components/AuthButton.js";

const LoginScreen = () => {
    return (
        <View>
            {/* <Text>I am Login Screen</Text> */}
            <View>
                {/* <Image source={require("./../assets/icon.png")}/> */}
                <Text>Sri Venkateshwara Engineering</Text>
                <View>
                    <AuthButton />
                </View>

            </View>
        </View>
    )
}

export default LoginScreen;