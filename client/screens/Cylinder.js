import { View, Text, StyleSheet, Image, ImageBackground, Pressable, ScrollView, Alert } from "react-native";
import stylesModule from "./Cylinder.module.css";
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
import DropDown from "react-native-paper-dropdown";
import {useState, useEffect} from "react";
import { Button, TextInput } from "react-native-paper";
import axios from "../utils/axios";
import useAuthContext from "../hooks/useAuthContext";
import * as Location from 'expo-location';
import Loader from "./../components/Loader";

const CylinderScreen = ({navigation, route}) => {
    const { user, authToken } = useAuthContext();
    const [cylinder, setCylinder] = useState(route.params.cylinder);
    const tableTitle = ["Barcode", "Serial Number", "Product Code", "Volume", "Manufactured Date", "Manufacturer", "Owner", "Branch", "Status", "Batch Number", "Filling Pressure", "Grade", "Last Test Date", "Transaction Status", "Tare Weight", "Test Due Date", "Minimum thickness", "Usage", "Valve", "Valve gaurd"];
    const tableData = [cylinder.barcode, cylinder.serial_number, cylinder.product_code, cylinder.volume, cylinder.manufactured_date, cylinder.manufacturer, cylinder.owner, cylinder.branch, cylinder.status, cylinder.batch_number, cylinder.filling_pressure, cylinder.grade, cylinder.last_test_date, cylinder.transaction_status, cylinder.tare_weight, cylinder.test_due_date, cylinder.minimum_thickness, cylinder.usage, cylinder.valve, cylinder.valve_gaurd];
    
    const [role, setRole] = useState("");
    const [actionTypes, setActionTypes] = useState([]);
    const [selectedActionType, setSelectedActionType] = useState("");


    // const [fillingPressure, setFillingPressure] = useState("");
    const [grade, setGrade] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [billId, setBillId] = useState("");
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


    const [loading, setLoading] = useState(false);

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
                setCompanies(companies_data);
            } catch (error) {
                console.error(error);
            }
            
        };

        getClients();
    }, [])

    useEffect(() => {
        const getRole = async () => {
          try {
            if(user) {
                const res = await axios.post("/user/getRole", {
                    email: user?.email,
                });
                //   setRole(res.data.role);
                const role = res.data.role;

                
                if(role.includes("admin")) {
                    let actions = [
                        {label : "Testing",  value : "tester"},
                        {label : "Filling",  value : "filler"},
                        {label : "Pickup",  value : "pickup"}
                    ];
                    setActionTypes(actions);

                    return;
                }
                if(role.length === 1) {
                    setSelectedActionType(role[0]);
                    return;
                }


                let actions = [];
                if(role.includes("tester")) {
                    actions.push({label : "Testing",  value : "tester"});
                }

                if(role.includes("filler")) {
                    actions.push({label : "Filling",  value : "filler"});
                }

                if(role.includes("pickup")) {
                    actions.push({label : "Pickup",  value : "pickup"});
                }

                setActionTypes(actions);
            }   
          } catch (error) {
            Alert.alert("something went wrong");
            console.error(error);
          }
          
        };
        getRole();
      }, []);

    useEffect(() => {
        axios
        .get(`/cylinder/barcode/${cylinder.barcode}`)
        .then((data) => {
            setCylinder(data.data.data);
        })
        .catch(err => {
            console.error(err);
        });

    }, []);

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

   

    const makeSubmitRequest = async (type, quantity, orderDetails) => {

        try {

            const newQuantity = 1*quantity;
            setLoading(true);
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
            setLoading(false);
            const resData = data.data;
            if(data.status === 200) {
                navigation.navigate("transactionSuccess", {data : resData})
            }
        } catch(error) {
            setLoading(false);
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

    const handleTestedSubmit =  async() => {
        try {
            setLoading(true);
            const testedRespone = await axios.patch(`/cylinder/tester/barcode/${cylinder.barcode}`, {}, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  Accept: "application/json",
                },
            });
            setLoading(false);
            if(testedRespone.status === 200) {
                Alert.alert("Test date updated successfully");
                navigation.navigate("cylinder", {cylinder : testedRespone.data.data});
                setSelectedActionType("");
            }
        } catch (error) {
            setLoading(false);
            Alert.alert("Something went wrong!");
            console.error(error);
        }
    }

    const handleFillerSubmit = async() => {
        const body = {
            // filling_pressure : fillingPressure,
            grade : grade,
            batch_number : batchNumber
        };

        try {
            setLoading(true);
            const updated = await axios.patch(`/cylinder/filler/barcode/${cylinder.barcode}`, body, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  Accept: "application/json",
                },
            });
    
            setLoading(false);
            if(updated.status === 200) {
                Alert.alert("Cylinder filling entry marked successfully");
                // navigation.navigate("cylinder", {cylinder : updated.data.updated});
                setCylinder(updated.data.updated);
                setSelectedActionType("");
            } else  {
                Alert.alert("Something went wrong");
            }
        } catch (error) {   
            setLoading(false); 
            Alert.alert("Either the cylinder is already full or something went wrong");
            console.error(error);
        }
        
    }
    const handleInputSubmit = async () => {
        
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
            await axios.get(`/cylinder/cylinder-report?barcode=${cylinder.barcode}`, {
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

    const handlePickupSubmit = async() => {

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            // location: '{"timestamp":1695456806278,"mocked":false,"coords":{"altitude":622.2000122070312,"heading":0,"altitudeAccuracy":100,"latitude":13.5531922,"speed":0,"longitude":78.5066255,"accuracy":100}}'
            const body = {
                billId,
                location
            };

            setLoading(true);
            const pickUpData = await axios.patch(`/cylinder/pickup/barcode/${cylinder.barcode}`, body , {
                    headers: {
                        "Accept": 'application/json',
                        "Authorization": `Bearer ${authToken}`
                    }
            });
            
            setLoading(false);
            if(pickUpData.status === 200) {
                Alert.alert("Cylinder pickup updated successfully");
                setSelectedActionType("");
                setCylinder(pickUpData.data.cylinder);
            } else  {
                Alert.alert("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Something went wrong!");
        }
        

    }

    return (
        <ScrollView>
        <Loader loading={loading}/>
        <View style={styles.container}>
            {actionTypes.length != 0 ? (
                <>
                <Text>Select Action Type</Text>
                <View>
                    <DropDown
                        label={"Select"}
                        mode={"outlined"}
                        value={transactionType}
                        setValue={setSelectedActionType}
                        list={actionTypes}
                        visible={showDropDown}
                        showDropDown={() => setShowDropDown(true)}
                        onDismiss={() => setShowDropDown(false)}
                        style={{ backgroundColor: 'white' }}
                        />
                </View>
                </>
            ) : <></>}
            
            {selectedActionType === "tester" ? (
                <>
                    <Text>Click the below button if you have tested it today</Text>
                    <Button
                        title = "Mark tested"
                        onPress={handleTestedSubmit}>
                            Mark Tested
                    </Button>
                </>
            ) : <></>}

            {selectedActionType === "filler" ? (
                <>
                    {/* <Text>Enter Filling Pressure</Text>
                    <TextInput 
                        placeholder="enter filling pressure"
                        value = {fillingPressure}
                        onChangeText = {setFillingPressure}
                    /> */}

                    <Text>Enter Grade</Text>
                    <TextInput 
                        placeholder="enter grade"
                        value = {grade}
                        onChangeText = {setGrade}
                    />

                    <Text>Batch Number</Text>
                    <TextInput 
                        placeholder="enter batch number"
                        value = {batchNumber}
                        onChangeText = {setBatchNumber}
                    />
                    <Button
                        title = "Submit"
                        onPress={handleFillerSubmit}>
                            Submit
                    </Button>
                </>
            ) : <></>}

            {selectedActionType === "pickup" && cylinder.trackingStatus === 0 ? <Text>Cylinder is empty, fill it first to dispatch</Text> : <></>}
            {selectedActionType === "pickup" && cylinder.trackingStatus !== 0 ? (
                <>
                    <Text>The current tracking status for this cylinder</Text>
                    {cylinder.actions?.map((el, idx) =><Text key={idx}>{idx+1}. {`Cylinder ${el.action} at ${el.date} and ${el.time} by ${el.performedBy} from (${el.latitude},${el.longitude})`}{"\n\n"}</Text>)}
                    
                    {cylinder.trackingStatus === 1 ? 
                    <>
                        <Text>Enter the Bill Id</Text>
                        <TextInput 
                            placeholder="enter billId"
                            value = {billId}
                            onChangeText = {setBillId}
                        />
                    </> : 
                    <>
                    </>}
                    
                    <Text>Click the submit button to move the cylinder to next stage</Text>
                   <Button
                        title = "Submit"
                        onPress={handlePickupSubmit}>
                            Submit
                    </Button> 

                    
                </>
            ) : <></>}
            <View>
                <Button
                    title = "Get transaction history"
                    onPress={handleGetTransactionHistory}>
                        Get transaction history
                </Button>
            </View>
            
           
            

        <Table borderStyle={{borderWidth: 1}}>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]} textStyle={styles.text}/>
                    <Col data={tableData} style={styles.title} heightArr={[100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]} textStyle={styles.text}/>
                </TableWrapper>
        </Table> 

        <View>
            <Text>Current transaction status</Text>
        </View>
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
    text: { textAlign: 'center' },
    mapContainer: { flex: 1 },
    map: {
        width: '100%',
        height: '100%',
    }
});

export default CylinderScreen;