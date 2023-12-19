import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import DropDown from "react-native-paper-dropdown";

import styles from "./AddCylinder";
import useAuthContext from "../hooks/useAuthContext"
import {useState, useEffect} from "react";
import axios from "./../utils/axios";

import { Card } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons'; 


const SingleUserCard = (props) => {
    return(
        <>
            <Card elevation={7}>
                <Text>
                    name: {props.user.name} 
                </Text>
                <Text>
                    email: {props.user.email} 
                </Text>
                <Text>
                    role: {props.user.role} 
                </Text>
            </Card>
        </>
    );
}

const AddUserScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ email, setEmail] = useState("");
    const [ password, setPasword] = useState("");
    const [ passwordConfirm, setPasswordConfirm] = useState("");
    const [ name, setName] = useState("");
    const [ role, setRole] = useState("store");
    const [showRoleDropDown, setShowRoleDropDown] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [users, setUsers] = useState([]);

    const [deleteUserEmail, setDeleteUserEmail] = useState("");

    const [changeRoleEmail, setChangeRoleEmail] = useState("");
    const [roleChange, setRoleChange] = useState("");
    const [showRoleChangeDropDown, setShowRoleChangeDropDown] = useState(false);
    
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

    const deleteUser = () => {
        axios.delete(`/user/${deleteUserEmail}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            },
        }).then(data => {
            Alert.alert(`${deleteUserEmail} deleted successfully`);
        }).catch(err => Alert.alert("Something went wrong"));
    }
    
    const changeRole = () => {
        axios.patch("/user/changeRole", {
            email: changeRoleEmail,
            newRole: roleChange
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            }
        })
        .then(data => {
            navigation.navigate("dashboard");
        }).catch(err => Alert.alert("something went wrong"));
    }

    useEffect(() => {
        axios.get(`/user?limit=5&pageNumber=${pageNumber}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            }
        }).then((data) => {
            setUsers(data.data.users);
        }).catch(err => console.error(err));
    }, [pageNumber]);
    
    return (
        <ScrollView>
        <View style={stylesText.container}>
            <ScrollView>
                <View>
                    <Text>Email (case sensitive)</Text>
                    <TextInput  placeholder="Enter Email" onChangeText={setEmail} style={stylesText.inputField}/>

                    <Text>Name</Text>
                    <TextInput  placeholder="Enter Name" onChangeText={setName} style={stylesText.inputField}/>

                    <Text>Role</Text>
                    <DropDown
                        label={"Select"}
                        mode={"outlined"}
                        value={role}
                        setValue={setRole}
                        list={
                            [
                                {label : "Admin", value : "admin"},
                                {label : "Filler", value : "filler"},
                                {label : "Tester", value : "tester"},
                                {label : "Pickup", value : "pickup"}
                            ]
                        }
                        visible={showRoleDropDown}
                        showDropDown={() => setShowRoleDropDown(true)}
                        onDismiss={() => setShowRoleDropDown(false)}
                        style={stylesText.inputField}
                        />

                    <Text>Password</Text>
                    <TextInput  placeholder="enter the password" onChangeText={setPasword} style={stylesText.inputField} />

                    <Text>Password Confirm</Text>
                    <TextInput  placeholder="confirm your password" style={stylesText.inputField} onChangeText={setPasswordConfirm}/>

                    <Button
                        title = "Add User"
                        onPress={handleSubmit}>
                            Add User
                    </Button>
                </View>
                <View>
                    <Text style={stylesText.heading1}>Manage Users</Text>
                    {users.map((user, idx) => <SingleUserCard user={user} key={idx}/>)}
                    <View style={stylesText.pager}>
                        <View style={stylesText.pagerItem}>
                            <TouchableOpacity onPress={() => setPageNumber(pageNumber === 1 ? 1 : pageNumber-1)} disabled={pageNumber === 1}>
                                <AntDesign name="arrowleft" size={24} color="black" /> 
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text>{pageNumber}</Text>
                        </View>
                        <View style={stylesText.pagerItem}>
                            <TouchableOpacity onPress={() => setPageNumber(pageNumber+1)}>
                                <AntDesign name="arrowright" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={stylesText.deleteSection}>
                    <Text style={stylesText.heading1}>Change User role</Text>

                    <TextInput  placeholder="Enter user's email" style={stylesText.inputField} onChangeText={setChangeRoleEmail}/>
                    <DropDown
                        label={"Select"}
                        mode={"outlined"}
                        value={roleChange}
                        setValue={setRoleChange}
                        list={
                            [
                                {label : "Admin", value : "admin"},
                                {label : "Filler", value : "filler"},
                                {label : "Tester", value : "tester"},
                                {label : "Pickup", value : "pickup"}
                            ]
                        }
                        visible={showRoleChangeDropDown}
                        showDropDown={() => setShowRoleChangeDropDown(true)}
                        onDismiss={() => setShowRoleChangeDropDown(false)}
                        style={stylesText.dropdownStyling}
                        />
                    <Button title="change role" onPress={changeRole}/>
                </View >

                <View style={stylesText.deleteSection}>
                    <Text style={stylesText.heading1}>Delete User</Text>

                    <TextInput  placeholder="Enter user's email" style={stylesText.inputField} onChangeText={setDeleteUserEmail}/>
                    
                    <Button title="delete user" onPress={deleteUser}/>
                </View>
            </ScrollView>
            
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
    text: { textAlign: 'center' },
    inputField: {
        borderWidth: 2,
        borderRadius: 4,
        alignItems: "center",
        height: 50,
        padding: 10,
        marginBottom: 10
    },
    pager: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        margin: 10
    },
    pagerItem: {
        flex: 1,
        alignItems: "center"
    },
    heading1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    },
    deleteSection: {
        marginTop: 100
    },
    dropdownStyling: {
        marginBottom: 30
    }
});


export default AddUserScreen;