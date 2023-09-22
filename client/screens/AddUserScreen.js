import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert } from "react-native";
import DropDown from "react-native-paper-dropdown";

import styles from "./AddCylinder";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "./../utils/axios";

const AddUserScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ email, setEmail] = useState("");
    const [ password, setPasword] = useState("");
    const [ passwordConfirm, setPasswordConfirm] = useState("");
    const [ name, setName] = useState("");
    const [ role, setRole] = useState("store");
    const [showRoleDropDown, setShowRoleDropDown] = useState(false);

    const handleSubmit = () => {
        if(password != passwordConfirm) {
            Alert.alert("Password and confirm password are not matching");
            return;
        }
        const user = {
            email,
            password,
            passwordConfirm,
            name,
            role
        };
        console.log(user);
        axios.post("/user/addUserManual", user , {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            },
        }).then((data) => {
            Alert.alert(`User has been created with email ${email}`);

            navigation.navigate("dashboard");
        }).catch(error => {
            console.error(error);
            Alert.alert("something went wrong");
        })
    }

    
    return (
        <ScrollView>
        <View style={stylesText.container}>
            {/* <ScrollView> */}
                <Text>Email (case sensitive)</Text>
                <TextInput  placeholder="Enter Email" onChangeText={setEmail} style={styles.inputStyle}/>

                <Text>Name</Text>
                <TextInput  placeholder="Enter Name" onChangeText={setName} style={styles.inputStyle}/>

                <Text>Role</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={role}
                    setValue={setRole}
                    list={
                        [
                            {label : "Admin", value : "admin"},
                            {label : "Store", value : "store"}
                        ]
                    }
                    visible={showRoleDropDown}
                    showDropDown={() => setShowRoleDropDown(true)}
                    onDismiss={() => setShowRoleDropDown(false)}
                    />

                <Text>Password</Text>
                <TextInput  placeholder="enter the password" onChangeText={setPasword} style={styles.inputStyle} />

                <Text>Password Confirm</Text>
                <TextInput  placeholder="confirm your password" style={styles.inputStyle} onChangeText={setPasswordConfirm}/>

                <Button
                    title = "Add User"
                    onPress={handleSubmit}>
                        Add User
                </Button>

            {/* </ScrollView> */}
            
        </View>
        </ScrollView>
    )
}

const stylesText = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center' }
});

export default AddUserScreen;