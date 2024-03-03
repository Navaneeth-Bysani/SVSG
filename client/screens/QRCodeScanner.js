import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "./../utils/axios";
import useAuthContext from "../hooks/useAuthContext";
import handleErrors from "../utils/handleErrors";

export default function QRCodeScanner({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const {authToken} = useAuthContext();
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      setScanned(true);
      try {
        
        const response = await axios.get(`/resource/${data}`, {
          headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
          }
        });
        const resource = response.data.resource;
        if(resource.type === "cylinder") {
          navigation.navigate("cylinder", {cylinder : resource.data});
        } else if(resource.type === "duraCylinder") {
          navigation.navigate("duracylinder", {cylinder : resource.data});
        } else if(resource.type === "permanentPackage") {
          Alert.alert("Permanent package page not added yet");
        }
      } catch (error) {
          handleErrors(error);
      }
        
    } catch (error) {
      console.error(error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          Scanning for Cylinder
        </Text>
      </View>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style = {StyleSheet.absoluteFillObject}
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


// https://www.youtube.com/watch?v=3mMyd3r2LRc
