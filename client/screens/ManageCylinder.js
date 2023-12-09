import {React, useEffect, useState} from 'react';
import { Text, View, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";

const SingleCylinder = (props) => {
    return(
        <>
            <Pressable onPress={() => {
                props.navigation.navigate("cylinder", {cylinder:props.cylinder})
            }}>
            <Card title={props.cylinder.barcode} elevation={7}>
                <Text>
                    Barcode: {props.cylinder.barcode} 
                </Text>
                <Text>
                    Serial Number: {props.cylinder.serial_number}
                </Text>
                <Text>
                    Product code: {props.cylinder.product_code}
                </Text>
                <Text>
                    Volume: {props.cylinder.volume}
                </Text>
                <Text>
                    Status: {props.cylinder.status}
                </Text>
                
            </Card> 
            </Pressable>
                   
        </>
    )
};

const ManageCylinder = ({navigation}) => {
    const [cylinders, setCylinders] = useState();
    const { authToken } = useAuthContext();
    useEffect(() => {
        const getCylinders = async() => {
            try {
                const cylindersData = await axios.get("/cylinder", {
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
    }, [])
    
    return(
        <>
            <ScrollView>
                {
                cylinders?.length === 0 ? <Text>No cylinders as of now. Add some cylinders to view.</Text> :
                cylinders?.map((cylinder, idx) => <SingleCylinder cylinder={cylinder} key={idx} navigation={navigation}/>)}
            </ScrollView>
        </>
    )
};

export default ManageCylinder;