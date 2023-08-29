import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, Alert, ScrollView } from "react-native";
import styles from "./Dashboard.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState, useEffect} from "react";
import axios from "./../utils/axios";

const DashBoardScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [role, setRole] = useState("store");
    const [barcode, setBarcode] = useState("");
    useEffect(() => {
        const getRole = async () => {
          const res = await axios.post("/user/getRole", {
            email: user.email,
          });
          setRole(res.data.role);
        //   Alert.alert(res.data.role);
        };
        getRole();
      }, []);

    const handleSearch = async () => {
      try {        
        const content = await axios.get(`/material/barcode/${barcode}`);
        const material = content.data.material;
        navigation.navigate("material", {material : material});    
        } catch (error) {
          console.error(error);
        }
    }
    const getAllMaterialsReport = async () => {
      try {
        await axios.get("/material/report", {
          headers: {
              "Accept": 'application/json',
              'Content-Type': 'multipart/form-data',
              "Authorization": `Bearer ${authToken}`,
            }
      });
        Alert.alert("Materials report sent to email succesfully");
      } catch (error) {
        console.error(error);
      }
    }

    return (
        <View>
            <Text>Username : {user?.name}</Text>
            <Text>Role: {user?.role}</Text>
            <Text>{authToken ? "Logged In" : "Logged out"}</Text>
            <Button  title = "logout" style = {styles.qrButton} onPress = {() => logout()} />
            <Button title = "QR Scanning" style = {styles.qrButton} onPress={() => navigation.navigate("qrscanner")}/>
            {/* {role === "admin" && <Button title = "Add File" style = {styles.qrButton} onPress={() => navigation.navigate("addFile")}/>} */}
            {role === "admin" && <Button title = "Add Material" style = {styles.qrButton} onPress={() => navigation.navigate("addmaterial")}/>}
            {role === "admin" && <Button title = "Add Client" style = {styles.qrButton} onPress={() => navigation.navigate("addClient")}/>}
            {role === "admin" && <Button title = "Add User" style = {styles.qrButton} onPress={() => navigation.navigate("addUser")}/>}
            <Button title="Get Materials Report" style={styles.qrButton} onPress={() => getAllMaterialsReport()}/>
            <View style = {styles.searchBox}>
              <TextInput style={styles.inputStyle} placeholder="Enter barcode" onChangeText={setBarcode}/>
              <Button title = "search" onPress={handleSearch}/>
            </View>

        </View>
    )
}

export default DashBoardScreen;