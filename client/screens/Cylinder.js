import { View, Text, StyleSheet, Image, ImageBackground, Pressable, ScrollView, Alert } from "react-native";
import stylesModule from "./Cylinder.module.css";
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
import DropDown from "react-native-paper-dropdown";
import {useState, useEffect} from "react";
import { Button, TextInput } from "react-native-paper";
import axios from "../utils/axios";
import useAuthContext from "../hooks/useAuthContext";

const CylinderScreen = ({navigation, route}) => {
    const { authToken } = useAuthContext();
    const cylinder = route.params.cylinder;
    const tableTitle = ["Barcode", "Serial Number", "Product Code", "Volume", "Manufactured Date", "Manufacturer", "Owner", "Branch", "Status", "Batch Number", "Filling Pressure", "Grade", "Last Test Date", "Transaction Status"];
    const tableData = [cylinder.barcode, cylinder.serial_number, cylinder.product_code, cylinder.volume, cylinder.manufactured_date, cylinder.manufacturer, cylinder.owner, cylinder.branch, cylinder.status, cylinder.batch_number, cylinder.filling_pressure, cylinder.grade, cylinder.last_test_date, cylinder.transaction_status];
    
    
    const input_types = [
        { label: "Input", value: "input" },
        { label: "Output", value: "output" }
      ];

    const [materialBarcode, setMaterialBarcode] = useState(cylinder.barcode);
    const [transactionType, setTransactionType] = useState("");
    const [quantity, setQuantity] = useState("");
    const [company, setCompany] = useState("");
    const [projectNumber, setProjectNumber] = useState("");
    const [materialProvidedTo, setMaterialProvidedTo] = useState("");
    const [manufacturerCertificateAvailable, setManufacturerCertificateAvailable] = useState(false);
    const [sveTested, setSveTested] = useState(false);
    const [billed, setBilled] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState("");

    const [showSveTestedDropDown, setShowSveTestedDropDown] = useState("");

    const [showDropDown, setShowDropDown] = useState(false);
    const [showCompanyDropDown, setShowCompanyDropDown] = useState(false);
    const [showManufacturerCertificateDropDown, setShowManufacturerCertificateDropDown] = useState(false);
    const [showBilledDropDown, setShowBilledDropDown] = useState(false);
    const [companies, setCompanies] = useState([]);

    useEffect(()=> {

        const getClients = async () => {
            try {
                const data = await axios.get("/client", {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: "application/json",
                    }
                });
                const companies_data = data.data.clients.map(el => {
                    return {
                        label : el.name,
                        value : el._id
                    }
                });
                // Alert.alert(JSON.stringify(companies_data[0].label));
                setCompanies(companies_data);
            } catch (error) {
                console.error(error);
            }
            
        };

        getClients();
    }, [])

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

    // const companies = [
    //     {label : "ABC company", value : "abc"},
    //     {label : "XYZ enterprise", value : "xyz enterprise"}
    // ]

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
                material_provided_to : materialProvidedTo,
                billed: billed,
                invoice_no : invoiceNumber
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
                sve_tested_material : sveTested,
                billed : billed,
                invoice_no : invoiceNumber
            };
            await makeSubmitRequest("input", quantity, orderDetails);
            nullifyVariables();

        } catch (error) {
            console.error(error)
        }
    }

    const handleGetTransactionHistory = async() => {
        try {
            await axios.get(`/material/material-report?barcode=${cylinder.barcode}`, {
                headers: {
                    "Accept": 'application/json',
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${authToken}`,
                  }
            });
            Alert.alert("Email sent successfully");
        } catch (error) {
            Alert.alert("something went wrong");
            console.error(error);
        }
    }

    return (
        <ScrollView>
        <View style={styles.container}>
            
            
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

            <View>
                <Button
                    title = "Get transaction history"
                    onPress={handleGetTransactionHistory}>
                        Get transaction history
                </Button>
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

                <Text>Is it billed?</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={billed}
                    setValue={setBilled}
                    list={
                        [
                            {label : "YES", value : true},
                            {label : "NO", value : false}
                        ]
                    }
                    visible={showBilledDropDown}
                    showDropDown={() => setShowBilledDropDown(true)}
                    onDismiss={() => setShowBilledDropDown(false)}
                    />

                <Text>Invoice Number</Text>
                <TextInput
                    value = {invoiceNumber}
                    onChangeText={setInvoiceNumber}
                    placeholder="Number"
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

                <Text>Is it billed?</Text>
                <DropDown
                    label={"Select"}
                    mode={"outlined"}
                    value={billed}
                    setValue={setBilled}
                    list={
                        [
                            {label : "YES", value : true},
                            {label : "NO", value : false}
                        ]
                    }
                    visible={showBilledDropDown}
                    showDropDown={() => setShowBilledDropDown(true)}
                    onDismiss={() => setShowBilledDropDown(false)}
                    />

                <Text>Invoice Number</Text>
                <TextInput
                    value = {invoiceNumber}
                    onChangeText={setInvoiceNumber}
                    placeholder="Number"
                    />
            <Button
                title = "Submit"
                onPress={handleInputSubmit}>
                    Submit
            </Button>
        </View>
           ) : (<></>)}
            

        <Table borderStyle={{borderWidth: 1}}>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]} textStyle={styles.text}/>
                    <Col data={tableData} style={styles.title} heightArr={[100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]} textStyle={styles.text}/>
                </TableWrapper>
        </Table> 
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

export default CylinderScreen;