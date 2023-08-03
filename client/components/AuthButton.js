import { Pressable, View, Text, Alert } from "react-native"
import {useState, useEffect} from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import useAuthContext from "../hooks/useAuthContext";
import axios from "../utils/axios";

WebBrowser.maybeCompleteAuthSession();

//web - 495416618853-829apeepcgjgk0dlq6shnoi2shc1s81e.apps.googleusercontent.com
//android - 495416618853-38c6fcv940dh05m9d4uj2dbgf97gqc21.apps.googleusercontent.com
//ios - 495416618853-3uvbg1s5ms9csqlhnuoqkcetdpcd6201.apps.googleusercontent.com

const AuthButton = () => {
    const [token, setToken] = useState("");

    const { login } = useAuthContext();
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
          "495416618853-38c6fcv940dh05m9d4uj2dbgf97gqc21.apps.googleusercontent.com",
        iosClientId:
          "495416618853-3uvbg1s5ms9csqlhnuoqkcetdpcd6201.apps.googleusercontent.com",
        webClientId : "495416618853-829apeepcgjgk0dlq6shnoi2shc1s81e.apps.googleusercontent.com",
        expoClientId : "495416618853-829apeepcgjgk0dlq6shnoi2shc1s81e.apps.googleusercontent.com",
        

      });
      useEffect(() => {
        // console.log({ response });
        if (response?.type === "success") {
          setToken(response.authentication.accessToken);
          getUserInformation(response.authentication.accessToken);
        }
      }, [response, token]);

      const getUserInformation = async (token) => {
        try {
          const loginResponse = await axios.post("/auth/google", { token });
          console.log(loginResponse.data.jwt);
          const data = loginResponse.data.user;
          const authToken = loginResponse.data.jwt;
          login(data, authToken);
        } catch (error) {
          Alert.alert(error.statusCode)
          if(error.statusCode === 401) {
            Alert.alert("Please Login from an authorized email id");
            return;
          }
          console.error(error);
          // Add your own error handler here
        }
      };
    return(
        <View>
            <Pressable
                onPress={() => {
                    promptAsync();
                  }}
            >
                <View>
                    <Text>Sign in with google</Text>
                </View>
            </Pressable>
        </View>
    ) 
}

export default AuthButton;