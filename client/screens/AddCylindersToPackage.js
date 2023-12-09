import { View, StyleSheet, Text, TextInput, Button, ScrollView } from "react-native";
import {useState, useEffect} from "react";
import styles from "./AddCylinder.module.css";
import AddCylinderToPackageCard from "../components/AddCylinderToPackageCard";


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
    const packageType = route.params.packageType;
    const [cylinders, setCylinders] = useState([]);

    useEffect(() => {
        if(route.params.packageType === "temporary") {
            setNoOfCylinders(15);
        }
    }, [])

    // const CylinderCards = () => {
    //     return (
            
    //     )
    // }
    return (
        <View style={stylesText.container}>
            <ScrollView>
                {
                    packageType === "permanent" ? (
                        <>
                            <Text>Number of cylinder</Text>
                            <TextInput  placeholder="Enter Number of Cylinders" onChangeText={(text) => validateNumber(text, setNoOfCylinders)} style={styles.inputStyle}/>
                            <Text>{Array(noCylinders).fill(true).length}</Text>
                            {Array(noCylinders).fill(true).map((cylinder, idx) => (
                                <AddCylinderToPackageCard key={idx} barcode={"barcode"} />
                            ))}
                            {/* <> */}
                                {/* {
                                    Array(noCylinders)
                                    .fill(true)
                                    .map((item, index) => <AddCylinderToPackageCard key={index} barcode={"Enter Barcode"}/>)
                                } */}
                                {/* <AddCylinderToPackageCard key={"1"} barcode={"barcode"} /> */}
                            {/* </> */}
                            <Text>Hi</Text>
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