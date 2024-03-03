import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import DropDown from "react-native-paper-dropdown";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "../utils/axios";
import Loader from "../components/Loader";

const AddPackageScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [packageType, setPackageType] = useState("");
    const [showDropDown, setShowDropDown] = useState(false);

    const [ barcode, setBarcode ] = useState("");
    const [ serial_number, setSerialNumber] = useState("");
    const [ test_date, set_test_date ] = useState(new Date());
    const [ noOfCylinders, setNoOfCylinders] = useState(0);

    const [workingPressure, setWorkingPressure] = useState("");
    const [valves, setValves] = useState("");
    const [manifold, setManifold] = useState("");
    const [wheels, setWheels] = useState("");
    const [service, setService] = useState("");



    const [ showDatePicker, setShowDatePicker] = useState(false);

    const [ loading, setLoading ] = useState(false);

    const packageTypes = [
        {label : "Permanent", value : "permanent"},
        {label : "Temporary", value : "temporary"}
    ];

    const handleSubmit = () => {
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        const formatted_test_date = [
            test_date.getFullYear(),
            padTo2Digits(test_date.getMonth() + 1),
            padTo2Digits(test_date.getDate()),
        ].join('-');
        const packageData = {
            barcode,
            serial_number,
            last_test_date : formatted_test_date,
            number_of_cylinders : noOfCylinders,
            working_pressure : workingPressure,
            valves,
            manifold,
            wheels,
            service
        };
        // console.log(packageData);
        if(packageType === "permanent") {
            setLoading(true);
            axios.post("/package/permanent", packageData , {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    Accept: "application/json",
                },
            }).then((data) => {
                Alert.alert(`Permanent package has been created with barcode ${barcode}`);
                setLoading(false);
                navigation.navigate("addCylindersToPackage", {packageType, barcode, noOfCylinders});
            }).catch(error => {
                console.error(error);
                setLoading(false);
                Alert.alert("something went wrong");
            })
        }
        
    }

    const validateNumber = (text, setFun) => {
        let newText = '';
        let numbers = '0123456789';
    
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                Alert.alert("please enter numbers only");
            }
        }

        setFun(text);
    }
    
    const datePicked = (event, date) => {
        setShowDatePicker(false);
        set_test_date(date);
    }
    return (
        <ScrollView>
        <View style={stylesText.container}>
        <Loader loading={loading}/>
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
        {packageType !== "" ? (
            <>
            

                <Text>barcode (case sensitive)</Text>
                <TextInput  placeholder="Enter Barcode" onChangeText={setBarcode} style={stylesText.inputField}/>

                <Text>Serial Number</Text>
                <TextInput  placeholder="Enter Serial Number" onChangeText={setSerialNumber} style={stylesText.inputField}/>

                <Text>Test date</Text>
                {showDatePicker && <DateTimePicker mode="date" value={test_date} onChange={datePicked} display="default" is24Hour={true}/>}
                <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
                    <TextInput  placeholder="Select Date" style={stylesText.inputField} editable={false} value={test_date.toDateString()}/>
                </TouchableOpacity>

                <Text>Working Pressure</Text>
                <TextInput  placeholder="Enter Working Pressure" onChangeText={setWorkingPressure} style={stylesText.inputField}/>

                <Text>Valves</Text>
                <TextInput  placeholder="Enter Valves" onChangeText={setValves} style={stylesText.inputField}/>

                <Text>Manifold</Text>
                <TextInput  placeholder="Enter Manifold" onChangeText={setManifold} style={stylesText.inputField}/>

                <Text>Wheels</Text>
                <TextInput  placeholder="Enter Wheels" onChangeText={setWheels} style={stylesText.inputField}/>

                <Text>Service</Text>
                <TextInput  placeholder="Enter Service" onChangeText={setService} style={stylesText.inputField}/>

                {
                    packageType === "permanent" ? 
                    (<>
                        <Text>Number of cylinders</Text>
                        <TextInput  
                            placeholder="Enter number of cylinders" 
                            onChangeText={(text) => {
                                // Allow only numeric input
                                const numericValue = text.replace(/[^0-9]/g, '');
                                setNoOfCylinders(1*numericValue);
                            }} 
                            style={stylesText.inputField}
                            keyboardType="numeric"
                        />
                    </>)
                    : 
                    <>
                    </>
                }
               

                <Button
                    title = "Add Package"
                    onPress={handleSubmit}>
                        Add Package
                </Button>

            </>
        ) :
        <Text>
            Select a Package Type
        </Text>
        }
        

            
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

export default AddPackageScreen;