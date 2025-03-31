import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import DropDown from "react-native-paper-dropdown";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState, useEffect} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "../utils/axios";
import Loader from "../components/Loader";
import * as Location from 'expo-location';

const BulkDeliveryScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();
    const [actionType, setActionType] = useState("");
    const [showDropDown, setShowDropDown] = useState(false);

    const [ noOfBarcodes, setNoOfBarcodes] = useState(0);
    const [ barcodes, setBarcodes] = useState([]);

    const [billId, setBillId] = useState("");

    useEffect(() => {
        setBarcodes((prevBarcodes) => {
            // If reducing the count, slice the array
            if (noOfBarcodes < prevBarcodes.length) {
                return prevBarcodes.slice(0, noOfBarcodes);
            }
            // If increasing the count, extend the array while keeping existing values
            return [...prevBarcodes, ...Array(noOfBarcodes - prevBarcodes.length).fill({barcode: "", status: "", type: ""})];
        });
    }, [noOfBarcodes]);

    const InputData = () => {
        const type = actionTypes.find((item) => item.value === actionType);
        let input = null;
        
        if(type?.actionType === "warehousepickup" || type?.actionType === "plantpickup") {
            input = (<>
                <TextInput  placeholder="Enter Bill Id" onChangeText={setBillId} style={stylesText.inputField}/>
            </>)
        }

        return input;
    }

    // const barcodeChanged = (index, value) => {
    //     console.log("barcode changed", index, value);
    //     setBarcodes((prevCylinders) => {
    //         const newCylinders = [...prevCylinders];
    //         newCylinders[index].barcode = value;
    //         console.log(newCylinders);
    //         return newCylinders;
    //     });
    // }
    const barcodeChanged = (index, value) => {
        setBarcodes((prevBarcodes) => {
            return prevBarcodes.map((barcodeObj, i) =>
                i === index ? { ...barcodeObj, barcode: value } : barcodeObj
            );
        });
    };
    


    const [ loading, setLoading ] = useState(false);

    const actionTypes = [
        {label : "Pickup from SVSG Hosakote", value : "svsg_hosakote", actionType: "plantpickup"},
        {label : "Pickup from SVSG Peenya", value : "svsg_peenya", actionType: "warehousepickup"},
        {label : "Pickup from client", value : "client_pickup", actionType: "clientpickup"},
        {label : "Delivery to SVSG Hosakote", value : "svsg_hosakote_delivery", actionType: "plantdelivery"},
        {label : "Delivery to client", value : "client_delivery", actionType: "clientdelivery"},
        {label : "Delivery to SVSG Peenya", value : "svsg_peenya_delivery", actionType: "warehousedelivery"}
    ];

    const handleSubmit = async () => {
        // try {
        //     const {status} = await Location.requestForegroundPermissionsAsync();
        //     if (status !== 'granted') {
        //         setErrorMsg('Permission to access location was denied');
        //         throw new Error('Permission denied'); // Stop further execution
        //     }
        
        //     const {location} = await Location.getCurrentPositionAsync({});
        //     setLoading(true);
        //     const data = {
        //         actionType: actionTypes.find((item) => item.value === actionType)?.actionType,
        //         barcodes,
        //         billId,
        //         location
        //     }

        //     const response = await axios.post("/cylinder/pickup/bulk", data, {
        //         headers: {
        //             Authorization: `Bearer ${authToken}`,
        //             Accept: "application/json",
        //         }
        //     });

        //     const {message} = response.data;
        //     Alert.alert(message);
        //     setLoading(false);
        // } catch(err) {
        //     console.log(err);
        //     setLoading(false);
        //     Alert.alert("Error", "An error occurred while processing your request.");
        // }
        
        
        Location.requestForegroundPermissionsAsync()
        .then(({ status }) => {
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                throw new Error('Permission denied'); // Stop further execution
            }
            return Location.getCurrentPositionAsync({});
        })
        .then((location) => {
            console.log("Location:", location);
            location = location;
            setLoading(true);
            const data = {
                actionType: actionTypes.find((item) => item.value === actionType)?.actionType,
                barcodes : barcodes.map((el) => el.barcode),
                billId,
                location
            }
            axios.post("/cylinder/pickup/bulk", data, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    Accept: "application/json",
                }
            }).then(response => {
                const {message} = response.data;
                Alert.alert(message);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        })
        .catch((error) => {
            console.error("Error fetching location:", error);
        });

        
    }
    
    return (
        <ScrollView>
        <View style={stylesText.container}>
        <Loader loading={loading}/>
        <Text>Number of barcodes</Text>
        <TextInput  
            placeholder="Enter number of barcodes" 
            onChangeText={(text) => {
            // Allow only numeric input
            const numericValue = text.replace(/[^0-9]/g, '');
            setNoOfBarcodes(1*numericValue);
            }} 
            style={stylesText.inputField}
            keyboardType="numeric"
        />
        
        <DropDown
                label={"Select action type"}
                mode={"outlined"}
                value={actionType}
                setValue={setActionType}
                list={actionTypes}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                style={{ backgroundColor: 'white' }}
        />
 
        {InputData()}  
        <Text>Enter the barcodes below</Text>
        <Text>{`Taking input for ${noOfBarcodes}`}</Text>

        {barcodes.map((el, idx) => (
            <View key={idx}>
                <Text>{`Item ${idx+1}`}</Text>
                <Text>status: {el?.status}</Text>
                <Text>type: {el?.type}</Text>
                <TextInput  
                    placeholder="Enter Barcode" 
                    onChangeText={(data) => barcodeChanged(idx, data)} 
                    style={stylesText.inputField}
                    value= {barcodes[idx].barcode}
                    onEndEditing={() => {
                        const barcode = barcodes[idx].barcode;
                        if(barcode) {
                            axios.get(`/cylinder/pickup/status/${barcode}`, {
                                headers: {
                                    Authorization: `Bearer ${authToken}`,
                                    Accept: "application/json",
                                }
                            }).then(response => {
                                setBarcodes((prevBarcodes) => {
                                    const newBarcodes = [...prevBarcodes];
                                    newBarcodes[idx].status = response.data.response?.status;
                                    newBarcodes[idx].type = response.data.response?.type;
                                    return newBarcodes;
                                })
                            }).catch(err => {
                                if(err.status === 404) {
                                    setBarcodes((prevBarcodes) => {
                                        const newBarcodes = [...prevBarcodes];
                                        newBarcodes[idx].status = "Not found";
                                        newBarcodes[idx].type = "";
                                        return newBarcodes;
                                    })
                                }
                            });
                        }
                    }}
                />   
            </View>
        ))}     
        <Button
            title="Submit"
            onPress={handleSubmit}
        >
            Submit
        </Button>
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
    }
});

export default BulkDeliveryScreen;

//fix error handling, and entity status and type