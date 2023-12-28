import { View, Text, StyleSheet, Image, ImageBackground, Pressable, Button, TextInput, Alert, ScrollView, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./Dashboard.module.css";
import useAuthContext from "../hooks/useAuthContext"
import {useState, useEffect} from "react";
import axios from "./../utils/axios";
import { AntDesign, FontAwesome } from '@expo/vector-icons'; 
import Loader from "./../components/Loader";

const DashBoardScreen = ({navigation}) => {
    const {user, authToken, logout} = useAuthContext();

    const [role, setRole] = useState([]);
    const [barcode, setBarcode] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getRole = async () => {
          try {
            if(user) {
              const res = await axios.post("/user/getRole", {
                email: user?.email,
              });
              setRole(res.data.role);
            }   
          } catch (error) {
            Alert.alert("something went wrong");
            console.error(error);
          }
          
        //   Alert.alert(res.data.role);
        };
        getRole();
      }, []);

    const handleSearch = async () => {
      try {
        setLoading(true);
        //search for cylinder        
        const content = await axios.get(`/cylinder/barcode/${barcode}`);
        const cylinder = content.data.data;
        setLoading(false);
        navigation.navigate("cylinder", {cylinder : cylinder});  
        //if cylinder is not found, search for package
        //fill code for that  
      } catch (error) {
          Alert.alert("Something went wrong");
          console.error(error);
          setLoading(false);
      }
    }
    const getAllCylindersReport = async () => {
      try {
        await axios.get("/cylinder/report", {
          headers: {
              "Accept": 'application/json',
              'Content-Type': 'multipart/form-data',
              "Authorization": `Bearer ${authToken}`,
            }
      });
        Alert.alert("Materials report sent to email succesfully");
      } catch (error) {
        console.error(error);
      }
    }

    return (
        <ScrollView>
        <View>
          <Loader loading={loading}/>
          <View style={styles1.container_top}>
            <View style={styles1.card}>
              <Text>{user?.name}</Text>
              <Text>{user?.role.join(", ")}</Text>
            </View>
            <View style={styles1.buttonContainer}>
              <TouchableOpacity onPress={() => logout()}>
                  <AntDesign name="poweroff" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles1.barcodeScanSection}>
            <View style={styles1.barcodeInputSection}>
              <View style={styles1.barcodeInput}>
                <TextInput style={styles.inputStyle} placeholder="Enter barcode" onChangeText={setBarcode}/>
              </View>
              <View style={styles1.searchIcon}>
                <TouchableOpacity onPress={handleSearch}>
                  <AntDesign name="search1" size={40} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles1.scannerIcon}>
              <TouchableOpacity onPress={() => navigation.navigate("qrscanner")}>
                <AntDesign name="qrcode" size={40} color="black"/>
              </TouchableOpacity>  
            </View>
          </View>
          <View style={styles1.buttonGroup}>
            <View style={styles1.spacing}>
              <Button title="Cylinders" style={styles1.navBtns} onPress={() => navigation.navigate("manageCylinder")}/>
            </View>
            <View style={styles1.spacing}>
              <Button title="Packages" style={styles1.navBtns} onPress={() => navigation.navigate("addPackage")}/>
            </View>
            {
              role.includes("admin") ? 
                <View style={styles1.spacing}>
                  <Button title="Users" style={styles1.navBtns} onPress={() => navigation.navigate("addUser")}/>
                </View> : 
                <>
                </>
            }
          </View>
        </View>
        </ScrollView>
        // </KeyboardAvoidingView>

      // {/* </ScrollView> */}
    )
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_top: {
    flexDirection: "row",
    width: "100%"
  },
  card: {
    flex: 3,
    padding: 16,
  },
  buttonContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    margin: 4
  },
  barcodeScanSection: {
    flexDirection: "row",
    width: "100%",
    marginLeft: 16
  },
  barcodeInput: {
    flex: 4,
    paddingRight: 0,
    height: 40,
    borderWidth: 0,
    borderColor: 'transparent',
    width: "100%"
  },
  scannerIcon: {
    flex: 1,
  },
  barcodeInputSection: {
    flexDirection: "row",
    width:"100%",
    flex: 3,
    borderWidth: 2,
    borderRadius: 4
  },
  searchIcon: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center"
  },

  buttonGroup: {
    // width: "100%",
    // marginTop: 50,
    // flexDirection: 'column',
    // justifyContent: 'space-around'
    padding: 20
  },
  navBtns: {
    // margin: 50,
    width: "100%",
    marginVertical: 50
  },
  spacing: {
    padding: 10
  }
});

export default DashBoardScreen;