import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    ImageBackground, 
    TextInput, 
    Button, 
    Alert,
    Keyboard,
    TouchableWithoutFeedback, 
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import styles from "./RegularLoginScreen.module.css";
import AuthButton from "./../components/AuthButton.js";
import useAuthContext from "../hooks/useAuthContext";
import {useState} from "react";
import axios from "./../utils/axios";
import Loader from "../components/Loader.js";

const RegularLoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, authToken, user } = useAuthContext();

    const [loading, setLoading] = useState(false);

    // if(user && authToken) {
    //     navigation.navigate("Home");
    // }
    const handleLogin =  async () => {
        try {
            setLoading(true);
            const loginResponse = await axios.post("/auth/regular-login", {
                email, password
            });
            const data = loginResponse.data.user;
            const authToken = loginResponse.data.jwt;

            await login(data, authToken);
            setLoading(false);

        } catch (error) {
            Alert.alert("Something went wrong");
            console.error(error);
            setLoading(false);
        }
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Loader loading={loading}/>
                <SafeAreaView>
                    <Text>Enter your email address</Text>
                    <TextInput
                            autoCapitalize="none"
                            autoCompleteType="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            placeholder="enter email"
                            value = {email}
                            onChangeText = {setEmail}
                        />

                        <Text>Enter your password:</Text>
                        <TextInput 
                            autoCapitalize="none"
                            autoCompleteType="password"
                            autoCorrect={false}
                            secureTextEntry = {true}
                            placeholder="enter password"
                            value = {password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity>
                            <Button
                                title = "Login"
                                onPress={handleLogin}
                            />
                        </TouchableOpacity>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default RegularLoginScreen;