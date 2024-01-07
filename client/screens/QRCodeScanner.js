import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "./../utils/axios";

export default function QRCodeScanner({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      let res;
      setScanned(true);
      // Alert.alert(data);
      const content = await axios.get(`/cylinder/barcode/${data}`);
      const cylinder = content.data.data;
      navigation.navigate("cylinder", {cylinder : cylinder});  
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
