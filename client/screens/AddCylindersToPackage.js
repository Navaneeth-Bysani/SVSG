import { View, StyleSheet, Text, TextInput, Button, ScrollView, Alert } from "react-native";
import {useState, useEffect} from "react";
import styles from "./AddCylinder.module.css";
import AddCylinderToPackageCard from "../components/AddCylinderToPackageCard";
import useAuthContext from "../hooks/useAuthContext"
import axios from "../utils/axios";

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

    setFun(1*text);
}

const AddCylindersToPackage = ({navigation, route}) => {
    const [noCylinders, setNoOfCylinders] = useState(0);
    const [finalNoCylinders, setFinalNoCylinders] = useState(0);
    const packageType = route.params.packageType;
    const [cylinders, setCylinders] = useState([]);

    const {user, authToken, logout} = useAuthContext();
    useEffect(() => {
        if(route.params.packageType === "temporary") {
            setFinalNoCylinders(15);
        }
        setCylinders([]);
    }, [])

    const addBarcodes = (index, barcode) => {
        if(index >= finalNoCylinders) {
            Alert.alert("out of range");
        }
        const temp = [...cylinders];
        temp[index].barcode = barcode;
        setCylinders(temp);
    }

    const cylindersAdded = () => {
        setFinalNoCylinders(noCylinders);
        setCylinders(Array(noCylinders).fill({barcode:""}));
    }

    const addCylinders = () => {
        // Alert.alert(route.params.barcode);
        // axios.patch(`/package/permananet/barcode/cylinders/${route.params.barcode}`, {cylinders, number_of_cylinders: noCylinders}, {
        //     headers: {
        //         Authorization: `Bearer ${authToken}`,
        //         Accept: "application/json",
        //     }
        // }).then(() => {
        //     Alert.alert("Cylinders added succesfully");
        // }).catch((err) => {
        //     console.error(err);
        //     Alert.alert("Something went wrong");
        // })
        Alert.alert(cylinders.map(cylinder => cylinder.barcode).join(","));
    }
    return (
        <View style={stylesText.container}>
            <ScrollView>
                {
                    packageType === "permanent" ? (
                        <>
                            <Text>Number of cylinder</Text>
                            <TextInput  placeholder="Enter Number of Cylinders" onChangeText={(text) => validateNumber(text, setNoOfCylinders)} style={styles.inputStyle}/>
                            <Button
                                title={"Add"}
                                onPress={cylindersAdded}
                            >
                                Add
                            </Button>
                            {cylinders.map((cylinder, idx) => (
                                <AddCylinderToPackageCard key={idx} barcode={cylinder.barcode} index={idx} addBarcodes={addBarcodes} />
                            ))}

                            {cylinders.length !== 0 ? 
                            (<Button
                                title="submit"
                                onPress={addCylinders}
                            >
                                submit
                            </Button>) : <></>}
                        </>
                    ) : <></>
                }
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
    text: { textAlign: 'center' }
});

export default AddCylindersToPackage;