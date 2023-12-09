import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert } from "react-native";
import DropDown from "react-native-paper-dropdown";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "../utils/axios";

const AddPackageScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [packageType, setPackageType] = useState("");
    const [showDropDown, setShowDropDown] = useState(false);

    const [ barcode, setBarcode ] = useState("");
    const [ serial_number, setSerialNumber] = useState("");
    const [ test_date, set_test_date ] = useState("");


    const packageTypes = [
        {label : "Permanent", value : "permanent"},
        {label : "Temporary", value : "temporary"}
    ];

    const handleSubmit = () => {
        const packageData = {
            barcode,
            serial_number,
            test_date
        };
        console.log(packageData);
        if(packageType === "permanent") {
            axios.post("/package/permanent", packageData , {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    Accept: "application/json",
                },
            }).then((data) => {
                Alert.alert(`Permanent package has been created with barcode ${barcode}`);
    
                navigation.navigate("addCylindersToPackage", {packageType});
            }).catch(error => {
                console.error(error);
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
    
    return (
        <ScrollView>
        <View style={stylesText.container}>
        <DropDown
                label={"Select"}
                mode={"outlined"}
                value={packageType}
                setValue={setPackageType}
                list={packageTypes}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
        />
        {packageType !== "" ? (
            <>
            

                <Text>barcode (case sensitive)</Text>
                <TextInput  placeholder="Enter Barcode" onChangeText={setBarcode} style={styles.inputStyle}/>

                <Text>Serial Number</Text>
                <TextInput  placeholder="Enter Serial Number" onChangeText={setSerialNumber} style={styles.inputStyle}/>

                <Text>Test date</Text>
                <TextInput  placeholder="Enter Test Date in YYYY-MM-DD format" onChangeText={set_test_date} style={styles.inputStyle}/>

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
    text: { textAlign: 'center' }
});

export default AddPackageScreen;