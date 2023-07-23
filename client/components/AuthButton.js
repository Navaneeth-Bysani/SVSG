import { Pressable, View, Text } from "react-native"

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const AuthButton = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
          "659895759042-cos8bhaqckqq0ecdjtgk14ugo5pr1qum.apps.googleusercontent.com",
        expoClientId:
          "659895759042-m6m8f3qik452isp4t160vcilg0mojb1e.apps.googleusercontent.com",
      });
    
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