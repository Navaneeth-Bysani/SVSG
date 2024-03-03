import { View, StyleSheet, Text, TextInput, Button, ScrollView, Alert } from "react-native";
import {useState, useEffect} from "react";
import useAuthContext from "../hooks/useAuthContext"
import axios from "../utils/axios";
import DropDown from "react-native-paper-dropdown";
import Loader from "../components/Loader";
import ScanMultipleQR from "../components/ScanMultipleQR";

const AddCylindersToPackage = ({navigation, route}) => {
    

    // Extracting route params
    const {packageType, barcode, noOfCylinders} = route.params;

    // Related to drop down window
    const [inputType, setInputType] = useState("");
    const [showDropDown, setShowDropDown] = useState(false);

    // Related to loading
    const [loading, setLoading] = useState(false);

    // Setting necessary state variables
    const [cylinders, setCylinders] = useState([]);

    // Auth context for authorization
    const {authToken} = useAuthContext();

    useEffect(() => {
        // Update the cylinders array when noOfCylinders changes
        const newCylinders = Array.from({ length: noOfCylinders }, (_, index) => "");
        setCylinders(newCylinders);
    }, [noOfCylinders]);

    const addCylinders = () => {
        Alert.alert(barcode);
        setLoading(true);
        axios.patch(`/package/permanent/barcode/cylinders/${barcode}`, {cylinders, number_of_cylinders: noOfCylinders}, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            }
        }).then(() => {
            setLoading(false);
            Alert.alert("Cylinders added succesfully");
            navigation.navigate("managePackage")
        }).catch((err) => {
            console.error(err);
            setLoading(false);
            Alert.alert("Something went wrong");
        })
    }

    const inputTypes = [
        {label: "Scan QR", value: "qr"},
        {label: "Enter Barcodes", value: "manual"}
    ]

    const barcodeChanged = (index, value) => {
        setCylinders((prevCylinders) => {
            const newCylinders = [...prevCylinders];
            newCylinders[index] = value;
            return newCylinders;
        });
    }

    const addScannedCylinder = (barcode, idx) => {
        setCylinders((prevCylinders) => {
            const temp = [...prevCylinders];
            temp[idx] = barcode;
            return temp;
        });
    }
    return (
        <View style={stylesText.container}>
            <ScrollView>
                <Loader loading={loading}/>
                <Text>{`Taking input for ${noOfCylinders}`}</Text>
                <View>
                    <Text>How do you want to enter the data</Text>
                    <View>
                        <DropDown
                            label={"Select"}
                            mode={"outlined"}
                            value={inputType}
                            setValue={setInputType}
                            list={inputTypes}
                            visible={showDropDown}
                            showDropDown={() => setShowDropDown(true)}
                            onDismiss={() => setShowDropDown(false)}
                            style={{ backgroundColor: 'white' }}
                            />
                    </View>
                </View>
                <View>
                    {
                        inputType === "manual" ? (<View>
                                <Text>Cylinder data</Text>
                                {cylinders.map((el, idx) => (
                                    <View key={idx}>
                                        <Text>{`Cylinder ${idx+1}`}</Text>
                                        <TextInput  placeholder="Enter Barcode" onChangeText={(data) => barcodeChanged(idx, data)} style={stylesText.inputField}/>   
                                    </View>
                                ))}
                                <Button title="Add Barcodes" onPress={addCylinders}>
                                    Add Barcodes
                                </Button>
                            </View>
                         ):( <></>)
                    }
                    {
                        inputType === "qr" ? (
                        <>
                            <ScanMultipleQR 
                                noOfItems={noOfCylinders} 
                                setItems={addScannedCylinder}
                                style={{ width : 100, height : 100}}
                            />
                            {cylinders.map((cylinder, idx) => <Text key={idx}>{cylinder}</Text>)}
                            <Button 
                                title="Add Cylinders"
                                onPress={addCylinders}
                            />
                         </>
                        ) : (<></>)
                    }
                </View>
            </ScrollView>
        </View>
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

export default AddCylindersToPackage;