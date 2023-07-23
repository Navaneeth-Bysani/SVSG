import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput } from "react-native";
import styles from "./Dashboard.module.css";

const DashBoardScreen = ({navigation}) => {
    return (
        <View>
            <TextInput style={styles.inputStyle} />
            <Button title = "QR Scanning" style = {styles.qrButton} onPress={() => navigation.navigate("qrscanner")}/>
        </View>
    )
}

export default DashBoardScreen;