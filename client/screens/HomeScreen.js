import { View, Text, StyleSheet, Image, ImageBackground, Pressable } from "react-native";
import styles from "./Home.module.css";

const HomeScreen = ({navigation}) => {
    return (
        <View>
            {/* <Text>I am Login Screen</Text> */}
            <View style={styles.main}>
                <Pressable onPress={() => navigation.navigate("dashboard")} style = {styles.logo}>
                    <Image source={require("./../assets/logo.jpg")}/>
                </Pressable>
                <Text>Sri Vishnu Speciality Gases</Text>
                {/* <Image source={require("./../assets/logo.jpg")} /> */}

            </View>
        </View>
    )
}

export default HomeScreen;