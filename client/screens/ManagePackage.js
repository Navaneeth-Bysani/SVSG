import {React, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Alert, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; 
import getUserRoles from '../utils/getUserRoles';
import DropDown from "react-native-paper-dropdown";

const SinglePermanentPackage = (props) => {
    return(
        <>
            <Pressable onPress={() => {
                props.navigation.navigate("permanentPackage", {packageData:props.packageData})
            }}>
            <Card title={props.packageData.barcode} elevation={7}>
                <Text>
                    Barcode: {props.packageData.barcode.toUpperCase()} 
                </Text>
                <Text>
                    Serial Number: {props.packageData.serial_number}
                </Text>
                <Text>
                    No. of cylinders: {props.packageData.number_of_cylinders}
                </Text>
            </Card> 
            </Pressable>
                   
        </>
    )
};

const ManagePackage = ({navigation}) => {
    const [packages, setPackages] = useState();
    const { authToken, user } = useAuthContext();
    const [role, setRole] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if(user) {
          getUserRoles(user.email).then(role => setRole(role));
        }
    }, []);

    const packageTypes = [
        {label : "Permanent", value : "permanent"},
        {label : "Temporary", value : "temporary"}
    ];
    const [packageType, setPackageType] = useState("permanent");
    const [showDropDown, setShowDropDown] = useState(false);

    const getAllCylindersReport = async () => {
        try {
          await axios.get("/cylinder/report", {
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
        const getPackages = async() => {
            try {
                const packagesData = await axios.get(`/package/${packageType}?limit=10&pageNumber=${pageNumber}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: "application/json",
                    }
                });
                console.log(packagesData.data);
                setPackages(packagesData.data.data);
            } catch (error) {
                console.error(error);
            }
            
        }
        getPackages();
    }, [pageNumber, packageType])
    
    return(
        <>
            
            <ScrollView>
                <View style={styles.headRow}>
                    {(role.includes("admin")) && <View style={styles.headRowItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("addPackage")}>
                            <Ionicons name="add" size={50} color="black" />
                        </TouchableOpacity>
                    </View>}
                    
                    {/* {(role.includes("admin")) && <View style={styles.headRowItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("addFile")}>
                            <MaterialCommunityIcons name="microsoft-excel" size={50} color="black" />
                        </TouchableOpacity>
                    </View>} */}

                    {/* <View style={styles.headRowItem}>
                        <TouchableOpacity onPress={() => getAllCylindersReport()}>
                            <AntDesign name="book" size={50} color="black" />
                        </TouchableOpacity>
                    </View> */}
                </View>
                <View style={styles.container}>
                    <DropDown
                            label={"Select"}
                            mode={"outlined"}
                            value={packageType}
                            setValue={setPackageType}
                            list={packageTypes}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                            style={{ backgroundColor: 'white' }}
                    />
                {
                    packages?.length === 0 ? <Text>No packages as of now. Add some packages to view.</Text> :
                    packages?.map((packageData, idx) => <SinglePermanentPackage packageData={packageData} key={idx} navigation={navigation}/>)
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
    },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' }
})
export default ManagePackage;