import {React, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Alert, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; 
import getUserRoles from '../utils/getUserRoles';

const SingleDuraCylinder = (props) => {
    return(
        <>
            <Pressable onPress={() => {
                props.navigation.navigate("duracylinder", {cylinder:props.cylinder})
            }}>
            <Card title={props.cylinder.barcode} elevation={7}>
                <Text>
                    Barcode: {props.cylinder.barcode.toUpperCase()} 
                </Text>
                <Text>
                    Serial Number: {props.cylinder.serial_number}
                </Text>
                <Text>
                    Capacity: {props.cylinder.volume}
                </Text>
                <Text>
                    Status: {props.cylinder.status}
                </Text>    
            </Card> 
            </Pressable>
                   
        </>
    )
};

const ManageDuraCylinder = ({navigation}) => {
    const [cylinders, setCylinders] = useState();
    const { authToken, user } = useAuthContext();
    const [role, setRole] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    useEffect(() => {
        if(user) {
          getUserRoles(user.email).then(role => setRole(role));
        }
    }, []);
    const getAllCylindersReport = async () => {
        try {
          await axios.get("/duracylinder/report", {
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
    useEffect(() => {
        const getCylinders = async() => {
            try {
                const cylindersData = await axios.get(`/duracylinder?limit=10&pageNumber=${pageNumber}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: "application/json",
                    }
                });
                setCylinders(cylindersData.data.data);
            } catch (error) {
                console.error(error);
            }
            
        }
        getCylinders();
    }, [pageNumber])
    
    return(
        <>
            <ScrollView>
                <View style={styles.headRow}>
                    {(role.includes("admin")) && <View style={styles.headRowItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("addDuraCylinder")}>
                            <Ionicons name="add" size={50} color="black" />
                        </TouchableOpacity>
                    </View>}
                    
                    {(role.includes("admin")) && <View style={styles.headRowItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("addDuraFile")}>
                            <MaterialCommunityIcons name="microsoft-excel" size={50} color="black" />
                        </TouchableOpacity>
                    </View>}

                    <View style={styles.headRowItem}>
                        <TouchableOpacity onPress={() => getAllCylindersReport()}>
                            <AntDesign name="book" size={50} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    cylinders?.length === 0 ? <Text>No cylinders as of now. Add some cylinders to view.</Text> :
                    cylinders?.map((cylinder, idx) => <SingleDuraCylinder cylinder={cylinder} key={idx} navigation={navigation}/>)
                }
                <View style={styles.pager}>
                    <View style={styles.pagerItem}>
                        <TouchableOpacity onPress={() => setPageNumber(pageNumber === 1 ? 1 : pageNumber-1)} disabled={pageNumber === 1}>
                            <AntDesign name="arrowleft" size={24} color="black" /> 
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text>{pageNumber}</Text>
                    </View>
                    <View style={styles.pagerItem}>
                        <TouchableOpacity onPress={() => setPageNumber(pageNumber+1)}>
                            <AntDesign name="arrowright" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    )
};

const styles = StyleSheet.create({
    headRow: {
        flexDirection: "row",
        width: "100%",
        padding: 16,
        alignItems: "center"
    },
    headRowItem: {
        flex: 1,
        borderColor: "black",
        borderWidth: 2,
        alignItems: "center",
        height: 60,
        margin: 10
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
    }
})
export default ManageDuraCylinder;