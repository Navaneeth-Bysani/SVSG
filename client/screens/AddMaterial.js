import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, ScrollView, Alert } from "react-native";
import styles from "./AddMaterial.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState} from "react";
import axios from "./../utils/axios";

const AddMaterialScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [ barcode, setBarcode] = useState("");
    const [ equipmentDetails, setEquipmentDetails] = useState("");
    const [ moc, setMoc] = useState("");
    const [ size, setSize] = useState("");
    const [ additionalDetails, setAdditionalDetails] = useState("");
    const [ availableQuantity, setAvailableQuantity] = useState("");
    const [ minimumQuantity, setMinimumQuantity] = useState("");

    const handleSubmit = () => {
        const material = {
            barcode,
            equipment_details : equipmentDetails,
            moc,
            size,
            additional_details : additionalDetails,
            available_quantity : 1*availableQuantity,
            minimum_quantity : 1*minimumQuantity
        };
        console.log(material);
        axios.post("/material", material , {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
            },
        }).then((data) => {
            Alert.alert(`Material has been created with barcode ${data.data.newMaterial.barcode}`);

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

                <Text>equipment_details</Text>
                <TextInput  placeholder="Enter Equipment Details" onChangeText={setEquipmentDetails} style={styles.inputStyle}/>

                <Text>Material of Construction</Text>
                <TextInput  placeholder="Enter Material of Construction" onChangeText={setMoc} style={styles.inputStyle}/>

                <Text>Size</Text>
                <TextInput  placeholder="Size" onChangeText={setSize} style={styles.inputStyle} />

                <Text>additional details</Text>
                <TextInput  placeholder="additional details" style={styles.inputStyle} onChangeText={setAdditionalDetails}/>

                <Text>available quantity</Text>
                <TextInput  placeholder="available quantity" keyboardType="numeric" value={availableQuantity} onChangeText={(text) => {validateNumber(text, setAvailableQuantity)}} style={styles.inputStyle}/>
                

                <Text>minimum quantity</Text>
                <TextInput  placeholder="minimum quantity" keyboardType="numeric" value={minimumQuantity} onChangeText={(text) => {validateNumber(text, setMinimumQuantity)}} style={styles.inputStyle}/>

                <Button
                    title = "Add Material"
                    onPress={handleSubmit}>
                        Add Material
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

export default AddMaterialScreen;