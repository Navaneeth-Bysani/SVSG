import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput } from "react-native";
import styles from "./Dashboard.module.css";
import useAuthContext from "../hooks/useAuthContext"

const DashBoardScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    return (
        <View>
            <Text>Username : {user?.name}</Text>
            <Text>Role: {user?.role}</Text>
            <Text>{authToken ? "Logged In" : "Logged out"}</Text>
            <Button  title = "logout" onPress = {() => logout()} />
            {/* <TextInput style={styles.inputStyle} /> */}
            <Button title = "QR Scanning" style = {styles.qrButton} onPress={() => navigation.navigate("qrscanner")}/>
            <Button title = "Add File" style = {styles.qrButton} onPress={() => navigation.navigate("addFile")}/>
            <Button title = "Add Material" style = {styles.qrButton} onPress={() => navigation.navigate("addmaterial")}/>
        </View>
    )
}

export default DashBoardScreen;