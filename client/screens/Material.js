import { View, Text, StyleSheet, Image, ImageBackground, Pressable, ScrollView, Alert } from "react-native";
import stylesModule from "./Material.module.css";
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
import DropDown from "react-native-paper-dropdown";
import {useState} from "react";
import { Button, TextInput } from "react-native-paper";
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";

const MaterialScreen = ({navigation, route}) => {
    const { authToken } = useAuthContext();
    const material = route.params.material;
    const tableTitle = ["Barcode", "Equipment Details", "MOC", "Size", "Additional Details", "Minimum Qty", "Available quantity"];
    const tableData = [material.barcode, material.equipment_details, material.moc, material.size, material.additional_details, material.minimum_quantity, material.available_quantity]
    
    const input_types = [
        { label: "Input", value: "input" },
        { label: "Output", value: "output" }
      ];

    const [materialBarcode, setMaterialBarcode] = useState(material.barcode);
    const [transactionType, setTransactionType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [company, setCompany] = useState("");
    const [projectNumber, setProjectNumber] = useState("");
    const [materialProvidedTo, setMaterialProvidedTo] = useState("");
    const [manufacturerCertificateAvailable, setManufacturerCertificateAvailable] = useState(false);
    const [sveTested, setSveTested] = useState(false);

    const [showSveTestedDropDown, setShowSveTestedDropDown] = useState("");

    const [showDropDown, setShowDropDown] = useState(false);
    const [showCompanyDropDown, setShowCompanyDropDown] = useState(false);
    const [showManufacturerCertificateDropDown, setShowManufacturerCertificateDropDown] = useState(false);



    const onChangeQuantity = (text) => {
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
        setQuantity(newText);
    }

    const companies = [
        {label : "ABC company", value : "abc"},
        {label : "XYZ enterprise", value : "xyz enterprise"}
    ]

    const makeSubmitRequest = async (type, quantity, orderDetails) => {

        try {

            const newQuantity = 1*quantity;
            const data = await axios.patch(`/material/barcode/store/${materialBarcode}`, {
                type,
                quantity : newQuantity,
                orderDetails
            },
            {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  Accept: "application/json",
                },
            }
            );

            const resData = data.data;
            if(data.status === 200) {
                navigation.navigate("transactionSuccess", {data : resData})
            }
        } catch(error) {
            console.error(error);
        }
    }
    const nullifyVariables = () => {
        setQuantity("");
        setCompany("");
        setProjectNumber("");
        setMaterialProvidedTo("");

        setManufacturerCertificateAvailable("");
        setSveTested("")
    }
    const handleOutputSubmit = async () => {
        // Alert.alert(`${transactionType}${quantity}-${company}-${projectNumber}-${materialProvidedTo}`);
       try {
            const orderDetails = {
                company_name : company,
                project_name : projectNumber,
                material_provided_to : materialProvidedTo
            };
            await makeSubmitRequest("output", quantity, orderDetails) 
            nullifyVariables();
       } catch (error) {
            console.error(error)
       }
        
    }

    const handleInputSubmit = async () => {
        // Alert.alert(`${transactionType}-${quantity}-${manufacturerCertificateAvailable} -${sveTested}`);
        
        try {
            const orderDetails = {
                manufacturer_test_certificate_available : manufacturerCertificateAvailable,
                sve_tested_material : sveTested
            };
            await makeSubmitRequest("input", quantity, orderDetails);
            nullifyVariables();

        } catch (error) {
            console.error(error)
        }
    }

    const OutputComponent = () => {
        return (
            <View>
                <Text>Quantity Being Used</Text>
                <TextInput
                    keyboardType="numeric"
                    value = {quantity}
                    onChangeText={text => onChangeQuantity(text)}
                    placeholder="Number"
                    />
                <Text>Company Name</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={company}
                    setValue={setCompany}
                    list={companies}
                    visible={showCompanyDropDown}
                    showDropDown={() => setShowCompanyDropDown(true)}
                    onDismiss={() => setShowCompanyDropDown(false)}
                    />
            
                <Text>Project Name or Number</Text>
                <TextInput 
                    placeholder="enter project name or number"
                    value = {projectNumber}
                    onChangeText = {setProjectNumber}
                />

                <Text>Material Provided to</Text>
                <TextInput 
                    placeholder="Material Provided to"
                    value = {materialProvidedTo}
                    onChangeText={setMaterialProvidedTo}
                />

                <Button
                    title = "Submit"
                    onPress={handleInputSubmit}>
                        Submit
                </Button>
            </View>
        )
    }

    const InputComponent = () => {
        return (
            <View>
                <Text>Quantity Being Added</Text>
                <TextInput
                    keyboardType="numeric"
                    value = {quantity}
                    onChangeText={text => onChangeQuantity(text)}
                    placeholder="Number"
                    />
                <Text>Manufacturer Test Certificate Available</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={manufacturerCertificateAvailable}
                    setValue={setManufacturerCertificateAvailable}
                    list={
                        [
                            {label : "YES", value : true},
                            {label : "NO", value : false}
                        ]
                    }
                    visible={showManufacturerCertificateDropDown}
                    showDropDown={() => setShowManufacturerCertificateDropDown(true)}
                    onDismiss={() => setShowManufacturerCertificateDropDown(false)}
                    />
            
                <Text>SVE tested material</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={sveTested}
                    setValue={setSveTested}
                    list={
                        [
                            {label : "YES", value : true},
                            {label : "NO", value : false}
                        ]
                    }
                    visible={showSveTestedDropDown}
                    showDropDown={() => setShowSveTestedDropDown(true)}
                    onDismiss={() => setShowSveTestedDropDown(false)}
                    />

                <Button
                    title = "Submit"
                    onPress={handleOutputSubmit}>
                        Submit
                </Button>
            </View>
        )
    }

    let FormComponent = <></>;

    if(transactionType === "input") {
        FormComponent = <InputComponent/>
    } else if(transactionType === "output") {
        FormComponent = <OutputComponent />
    }

    return (
        <ScrollView>
        <View style={styles.container}>
            <Table borderStyle={{borderWidth: 1}}>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[100, 100, 100, 100, 100, 100, 100]} textStyle={styles.text}/>
                    <Col data={tableData} style={styles.title} heightArr={[100, 100, 100, 100, 100, 100, 100]} textStyle={styles.text}/>
                </TableWrapper>
            </Table> 
            
            <Text>Select Transaction Type</Text>
            <View>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={transactionType}
                    setValue={setTransactionType}
                    list={input_types}
                    visible={showDropDown}
                    showDropDown={() => setShowDropDown(true)}
                    onDismiss={() => setShowDropDown(false)}
                    />
            </View>

            {/* {FormComponent} */}
           {transactionType === "output" ? (
                <View>
                <Text>Quantity Being Used</Text>
                <TextInput
                    keyboardType="numeric"
                    value = {quantity}
                    onChangeText={text => onChangeQuantity(text)}
                    placeholder="Number"
                    />
                <Text>Company Name</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={company}
                    setValue={setCompany}
                    list={companies}
                    visible={showCompanyDropDown}
                    showDropDown={() => setShowCompanyDropDown(true)}
                    onDismiss={() => setShowCompanyDropDown(false)}
                    />
            
                <Text>Project Name or Number</Text>
                <TextInput 
                    placeholder="enter project name or number"
                    value = {projectNumber}
                    onChangeText = {setProjectNumber}
                />

                <Text>Material Provided to</Text>
                <TextInput 
                    placeholder="Material Provided to"
                    value = {materialProvidedTo}
                    onChangeText={setMaterialProvidedTo}
                />

                <Button
                    title = "Submit"
                    onPress={handleOutputSubmit}>
                        Submit
                </Button>
            </View>
           ) : (<></>)}

           {transactionType === "input" ? (
            <View>
            <Text>Quantity Being Added</Text>
            <TextInput
                keyboardType="numeric"
                value = {quantity}
                onChangeText={text => onChangeQuantity(text)}
                placeholder="Number"
                />
            <Text>Manufacturer Test Certificate Available</Text>
            <DropDown
                label={"Select"}
                mode={"outlined"}
                value={manufacturerCertificateAvailable}
                setValue={setManufacturerCertificateAvailable}
                list={
                    [
                        {label : "YES", value : "yes"},
                        {label : "NO", value : "no"}
                    ]
                }
                visible={showManufacturerCertificateDropDown}
                showDropDown={() => setShowManufacturerCertificateDropDown(true)}
                onDismiss={() => setShowManufacturerCertificateDropDown(false)}
                />
        
            <Text>SVE tested material</Text>
            <DropDown
                label={"Select"}
                mode={"outlined"}
                value={sveTested}
                setValue={setSveTested}
                list={
                    [
                        {label : "YES", value : "yes"},
                        {label : "NO", value : "no"}
                    ]
                }
                visible={showSveTestedDropDown}
                showDropDown={() => setShowSveTestedDropDown(true)}
                onDismiss={() => setShowSveTestedDropDown(false)}
                />

            <Button
                title = "Submit"
                onPress={handleInputSubmit}>
                    Submit
            </Button>
        </View>
           ) : (<></>)}
            
        </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: {  height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 28  },
    text: { textAlign: 'center' }
});

export default MaterialScreen;