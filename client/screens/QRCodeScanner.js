import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "../utils/axios";

export default function QRCodeScanner({navigation}) {
//   const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
//   const [meal, setMeal] = useState({ type: "dinner", date: "20-03-23" });

//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   const chargeUserForMeal = async (encryptedString) => {
//     try {
//       const mealId = "642691dc08b00fad3c1b90a6";
//       const scanningHostel = "MHR";

//       const body = {
//         encryptedString,
//         mealId,
//         scanningHostel,
//       };

//       const res = await axios.post("/api/user/demo", body);
//       console.log({ res });
//       if (res.status === 201) {
//         Alert.alert("Success!");
//       }
//     } catch (err) {
//       console.error(err);
//       console.log(err.response?.data?.message);
//       Alert.alert("Error in scanning", err.response.data.message);
//     }
//   };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    alert(data);
    const res = await axios.post(`/material/barcode/${data}`);
    if(res.status === 404) {
        setScanned(false);
        Alert.alert("Invalid QR Code. Try again");
    } else if(res.status === 200) {
        navigation.navigate("material", {material : res.data.material})
    }
    // console.log(
    //   `Bar code with type ${type} and data ${data} has been scanned!`
    // );
    // chargeUserForMeal(data);
  };

//   if (hasPermission === null) {
//     // Alert.alert("Requesting for camera permission");
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     // Alert.alert("No camera permission");
//     return <Text>No access to camera</Text>;
//   }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          Scanning for Material
        </Text>
      </View>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: "80%", height: "80%" }}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
