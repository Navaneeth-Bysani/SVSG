import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert, TouchableOpacity } from "react-native";
import styles from "./AddCylinder.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "../utils/axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from "../components/Loader";

const AddDuraCylinderScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ barcode, setBarcode] = useState("");
    const [ serial_number, setSerialNumber] = useState("");
    const [ volume, setVolume] = useState("");
    const [tare_weight, set_tare_weight] = useState("");
    const [test_due_date, set_test_due_date] = useState(new Date());;
    const [valve, set_valve] = useState("");
    const [trv, setTrv] = useState("");
    const [level_gauge, set_level_gauge] = useState("");
    const [pressure_gauge, set_pressure_gauge] = useState("");
    const [make, setMake] = useState("");
    const [frame, setFrame] = useState("");
    const [adaptor, setAdaptor] = useState("");
    const [service, setService] = useState("");

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        const formatted_test_due_date = [
            test_due_date.getFullYear(),
            padTo2Digits(test_due_date.getMonth() + 1),
            padTo2Digits(test_due_date.getDate()),
          ].join('-');

        const material = {
            barcode,
            serial_number,
            volume,
            test_due_date: formatted_test_due_date,
            tare_weight,
            valve,
            trv,
            level_gauge,
            pressure_gauge,
            make,
            frame,
            adaptor,
            service
        };
        setLoading(true);
        axios.post("/duracylinder", material , {
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
        set_test_due_date(date);
    }
    return (
        <ScrollView>
        <View style={stylesText.container}>
            {/* <ScrollView> */}
                <Loader loading={loading}/>
                <Text>Barcode</Text>
                <TextInput  placeholder="Enter Barcode" onChangeText={setBarcode} style={stylesText.inputField}/>

                <Text>Serial Number</Text>
                <TextInput  placeholder="Enter Serial Number" onChangeText={setSerialNumber} style={stylesText.inputField}/>

                <Text>Capacity</Text>
                <TextInput  placeholder="Enter Capacity" onChangeText={setVolume} style={stylesText.inputField} />

                <Text>Test Due date</Text>
                {showDatePicker && <DateTimePicker mode="date" value={test_due_date} onChange={datePicked} display="default" is24Hour={true}/>}
                <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
                    <TextInput  placeholder="Select Date" style={stylesText.inputField} editable={false} value={test_due_date.toDateString()}/>
                </TouchableOpacity>

                <Text>Weight</Text>
                <TextInput  placeholder="Weight" onChangeText={set_tare_weight} style={stylesText.inputField}/>
                
                {/* <Text>Test Due Date</Text>
                <TextInput  placeholder="YYYY-MM-DD" onChangeText={set_test_due_date} style={stylesText.inputField}/> */}
                
                <Text>Valves</Text>
                <TextInput  placeholder="Valves" onChangeText={set_valve} style={stylesText.inputField}/>

                <Text>TRV</Text>
                <TextInput  placeholder="TRV" onChangeText={setTrv} style={stylesText.inputField}/>

                <Text>Level Gauge</Text>
                <TextInput  placeholder="Level gauge" onChangeText={set_level_gauge} style={stylesText.inputField}/>

                <Text>Pressure gauge</Text>
                <TextInput  placeholder="Pressure Gauge" onChangeText={set_pressure_gauge} style={stylesText.inputField}/>

                <Text>Make</Text>
                <TextInput  placeholder="Make" onChangeText={setMake} style={stylesText.inputField}/>

                <Text>Frame</Text>
                <TextInput  placeholder="Frame" onChangeText={setFrame} style={stylesText.inputField}/>

                <Text>Adaptor</Text>
                <TextInput  placeholder="Adaptor" onChangeText={setAdaptor} style={stylesText.inputField}/>

                <Text>Service</Text>
                <TextInput  placeholder="Service" onChangeText={setService} style={stylesText.inputField}/>

                <Button
                    title = "Add Dura Cylinder"
                    onPress={handleSubmit}>
                        Add Dura Cylinder
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

export default AddDuraCylinderScreen;