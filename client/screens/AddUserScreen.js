import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert, TouchableOpacity} from "react-native";
import Checkbox from 'expo-checkbox';

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
                    role: {props.user.role.join(", ")} 
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
    const [ role, setRole] = useState([]);
    const [showRoleDropDown, setShowRoleDropDown] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    const [users, setUsers] = useState([]);

    const [deleteUserEmail, setDeleteUserEmail] = useState("");

    const [changeRoleEmail, setChangeRoleEmail] = useState("");
    const [roleChange, setRoleChange] = useState([]);
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
    
    const checkboxData = [
        {label: "Admin", value: "admin"},
        {label: "Filler", value: "filler"},
        {label: "Tester", value: "tester"},
        {label: "Pickup", value: "pickup"}
    ];

    const handleCheckboxChange = (item) => {
        // Check if the item is already selected
        const isSelected = role.includes(item);
    
        if(item === "admin") {
            if(isSelected) {
                setRole([]);
            } else {
                setRole(["admin"]);
            }
            return;
        }

        // Update the selected items based on the checkbox state
        if (isSelected) {
          setRole(role.filter((selectedItem) => selectedItem !== item));
        } else {
          setRole([...role, item]);
        }
    };

    const handleRoleUpdateCheckboxChange = (item) => {
        const isSelected = roleChange.includes(item);
    
        if(item === "admin") {
            if(isSelected) {
                setRoleChange([]);
            } else {
                setRoleChange(["admin"]);
            }
            return;
        }

        // Update the selected items based on the checkbox state
        if (isSelected) {
          setRoleChange(roleChange.filter((selectedItem) => selectedItem !== item));
        } else {
          setRoleChange([...roleChange, item]);
        }
    }
    return (
        <ScrollView>
        <View style={stylesText.container}>
            <ScrollView>
                <View>
                    <Text>Email (case sensitive)</Text>
                    <TextInput  placeholder="Enter Email" onChangeText={setEmail} style={stylesText.inputField}/>

                    <Text>Name</Text>
                    <TextInput  placeholder="Enter Name" onChangeText={setName} style={stylesText.inputField}/>

                    <Text>Role (Select the roles you want to assign)</Text>
                    {checkboxData.map((checkboxItem) => (
                        <View key={checkboxItem.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                            <Checkbox
                                disabled={role.includes("admin") && checkboxItem.value !== "admin"}
                                value={role.includes(checkboxItem.value)}
                                onValueChange={(value) => handleCheckboxChange(checkboxItem.value)}
                                style={{marginRight: 10}}
                            />
                        <Text>{checkboxItem.label}</Text>
                        </View>
                    ))}

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

                    <Text>Select the Role you want to give among the following</Text>
                    {checkboxData.map((checkboxItem) => (
                        <View key={checkboxItem.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                            <Checkbox
                                disabled={roleChange.includes("admin") && checkboxItem.value !== "admin"}
                                value={roleChange.includes(checkboxItem.value)}
                                onValueChange={(value) => handleRoleUpdateCheckboxChange(checkboxItem.value)}
                                style={{marginRight: 10}}
                            />
                        <Text>{checkboxItem.label}</Text>
                        </View>
                    ))}  
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
        marginBottom: 10,
        backgroundColor: "white"
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
        marginBottom: 30,
        backgroundColor: "white"
    }
});


export default AddUserScreen;