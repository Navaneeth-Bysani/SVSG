import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "../utils/axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from "../components/Loader";

const AddCylinderScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ barcode, setBarcode] = useState("");
    const [ serial_number, setSerialNumber] = useState("");
    const [ product_code, setProductCode] = useState("");
    const [ volume, setVolume] = useState("");
    const [ manufactured_date, setManufacturedDate] = useState(new Date());
    const [ manufacturer, setManufacturer] = useState("");
    const [ owner, setOwner] = useState("");
    const [ branch, setBranch] = useState("");
    const [filling_pressure, setFillingPressure] = useState("");
    const [tare_weight, set_tare_weight] = useState("");
    // const [test_due_date, set_test_due_date] = useState("");
    const [minimum_thickness, set_minimum_thickness] = useState("");
    const [usage, set_usage] = useState("");
    const [valve, set_valve] = useState("");
    const [valve_gaurd, set_valve_gaurd] = useState("");

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        const formatted_manufactured_date = [
            manufactured_date.getFullYear(),
            padTo2Digits(manufactured_date.getMonth() + 1),
            padTo2Digits(manufactured_date.getDate()),
          ].join('-');

        const test_due_date = new Date(manufactured_date);
        //Fixed 5 years increment
        test_due_date.setFullYear(test_due_date.getFullYear() + 5);
        
        const formatted_test_due_date = [
            test_due_date.getFullYear(),
            padTo2Digits(test_due_date.getMonth() + 1),
            padTo2Digits(test_due_date.getDate()),
          ].join('-');

        const material = {
            barcode,
            serial_number,
            product_code,
            volume,
            manufactured_date: formatted_manufactured_date,
            manufacturer,
            owner,
            branch,
            filling_pressure,
            tare_weight,
            test_due_date: formatted_test_due_date,
            minimum_thickness,
            usage,
            valve,
            valve_gaurd
        };
        console.log(material);
        setLoading(true);
        axios.post("/cylinder", material , {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            },
        }).then((data) => {
            setLoading(false);
            Alert.alert(`Material has been created with barcode ${data.data.newOne.barcode}`);

            navigation.navigate("dashboard");
        }).catch(error => {
            setLoading(false);
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

    const datePicked = (event, date) => {
        setShowDatePicker(false);
        setManufacturedDate(date);
    }
    return (
        <ScrollView>
        <View style={stylesText.container}>
            {/* <ScrollView> */}
                <Loader loading={loading}/>
                <Text>barcode (case sensitive)</Text>
                <TextInput  placeholder="Enter Barcode" onChangeText={setBarcode} style={stylesText.inputField}/>

                <Text>Serial Number</Text>
                <TextInput  placeholder="Enter Serial Number" onChangeText={setSerialNumber} style={stylesText.inputField}/>

                <Text>Product</Text>
                <TextInput  placeholder="Enter Product Code" onChangeText={setProductCode} style={stylesText.inputField}/>

                <Text>Volume</Text>
                <TextInput  placeholder="Enter Volume" onChangeText={setVolume} style={stylesText.inputField} />

                <Text>Manufactured date</Text>
                {showDatePicker && <DateTimePicker mode="date" value={manufactured_date} onChange={datePicked} display="default" is24Hour={true}/>}
                <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
                    <TextInput  placeholder="Select Date" style={stylesText.inputField} editable={false} value={manufactured_date.toDateString()}/>
                </TouchableOpacity>

                <Text>Manufacturer</Text>
                <TextInput  placeholder="manufacturer"  onChangeText={setManufacturer} style={stylesText.inputField}/>

                <Text>Owner</Text>
                <TextInput  placeholder="owner" onChangeText={setOwner} style={stylesText.inputField}/>
                
                <Text>Branch</Text>
                <TextInput  placeholder="branch" onChangeText={setBranch} style={stylesText.inputField}/>

                <Text>Filling Pressure</Text>
                <TextInput  placeholder="filling pressure" onChangeText={setFillingPressure} style={stylesText.inputField}/>

                <Text>Tare Weight</Text>
                <TextInput  placeholder="Tare weight" onChangeText={set_tare_weight} style={stylesText.inputField}/>
                
                {/* <Text>Test Due Date</Text>
                <TextInput  placeholder="YYYY-MM-DD" onChangeText={set_test_due_date} style={stylesText.inputField}/> */}
                
                <Text>Minimum Thickness</Text>
                <TextInput  placeholder="Minimum Thickness" onChangeText={set_minimum_thickness} style={stylesText.inputField}/>
                
                <Text>Usage</Text>
                <TextInput  placeholder="Usage" onChangeText={set_usage} style={stylesText.inputField}/>

                <Text>Valve</Text>
                <TextInput  placeholder="Valve" onChangeText={set_valve} style={stylesText.inputField}/>

                <Text>Valve gaurd</Text>
                <TextInput  placeholder="Valve gaurd" onChangeText={set_valve_gaurd} style={stylesText.inputField}/>

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

export default AddCylinderScreen;