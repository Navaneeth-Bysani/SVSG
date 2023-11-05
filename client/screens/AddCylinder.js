import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert } from "react-native";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "../utils/axios";

const AddCylinderScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ barcode, setBarcode] = useState("");
    const [ serial_number, setSerialNumber] = useState("");
    const [ product_code, setProductCode] = useState("");
    const [ volume, setVolume] = useState("");
    const [ manufactured_date, setManufacturedDate] = useState("");
    const [ manufacturer, setManufacturer] = useState("");
    const [ owner, setOwner] = useState("");
    const [ branch, setBranch] = useState("");
    const [filling_pressure, setFillingPressure] = useState("");
    const [tare_weight, set_tare_weight] = useState("");
    const [test_due_date, set_test_due_date] = useState("");
    const [minimum_thickness, set_minimum_thickness] = useState("");
    const [usage, set_usage] = useState("");

    const handleSubmit = () => {
        const material = {
            barcode,
            serial_number,
            product_code,
            volume,
            manufactured_date,
            manufacturer,
            owner,
            branch,
            filling_pressure,
            tare_weight,
            test_due_date,
            minimum_thickness,
            usage
        };
        console.log(material);
        axios.post("/cylinder", material , {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            },
        }).then((data) => {
            Alert.alert(`Material has been created with barcode ${data.data.newOne.barcode}`);

            navigation.navigate("dashboard");
        }).catch(error => {
            console.error(error);
            Alert.alert("something went wrong");
        })
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
            {/* <ScrollView> */}
                <Text>barcode (case sensitive)</Text>
                <TextInput  placeholder="Enter Barcode" onChangeText={setBarcode} style={styles.inputStyle}/>

                <Text>Serial Number</Text>
                <TextInput  placeholder="Enter Serial Number" onChangeText={setSerialNumber} style={styles.inputStyle}/>

                <Text>Product</Text>
                <TextInput  placeholder="Enter Product Code" onChangeText={setProductCode} style={styles.inputStyle}/>

                <Text>Volume</Text>
                <TextInput  placeholder="Enter Volume" onChangeText={setVolume} style={styles.inputStyle} />

                <Text>Manufactured date</Text>
                <TextInput  placeholder="YYYY-MM-DD" style={styles.inputStyle} onChangeText={setManufacturedDate}/>
                

                <Text>Manufacturer</Text>
                <TextInput  placeholder="manufacturer"  onChangeText={setManufacturer} style={styles.inputStyle}/>

                <Text>Owner</Text>
                <TextInput  placeholder="owner" onChangeText={setOwner} style={styles.inputStyle}/>
                
                <Text>Branch</Text>
                <TextInput  placeholder="branch" onChangeText={setBranch} style={styles.inputStyle}/>

                <Text>Filling Pressure</Text>
                <TextInput  placeholder="filling pressure" onChangeText={setFillingPressure} style={styles.inputStyle}/>

                <Text>Tare Weight</Text>
                <TextInput  placeholder="Tare weight" onChangeText={set_tare_weight} style={styles.inputStyle}/>
                
                <Text>Test Due Date</Text>
                <TextInput  placeholder="YYYY-MM-DD" onChangeText={set_test_due_date} style={styles.inputStyle}/>
                
                <Text>Minimum Thickness</Text>
                <TextInput  placeholder="Minimum Thickness" onChangeText={set_minimum_thickness} style={styles.inputStyle}/>
                
                <Text>Usage</Text>
                <TextInput  placeholder="usage" onChangeText={set_usage} style={styles.inputStyle}/>

                <Button
                    title = "Add Cylinder"
                    onPress={handleSubmit}>
                        Add Cylinder
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

export default AddCylinderScreen;