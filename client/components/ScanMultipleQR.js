import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { StyleSheet, Text, Button, View } from "react-native";

const ScanMultipleQR = ({noOfItems, setItems}) => {
    // qr code camera related permissions
    const [hasPermission, setHasPermission] = useState(null);

    // variable to verify if all are scanned or not
    const [scanned, setScanned] = useState(false);
    const [allScanned, setAllScanned] = useState(false);

    const [noOfScanned, setNoOfScanned] = useState(0);
    const [scannedItems, setScannedItems] = useState([]);


    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === "granted");
        };
    
        getBarCodeScannerPermissions();
    }, []);


    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // useEffect(() => {
    //     if(noOfItems === noOfScanned) {
    //         setScanned(true);
    //     }
    // }, [noOfScanned]);

    const handleBarCodeScanned = async ({ type, data }) => {
        try {
            if(noOfItems-1 === noOfScanned) {
                setAllScanned(true);
            }
            setItems(data, noOfScanned);
            setNoOfScanned(noOfScanned + 1); 
            setScanned(true);
        } catch (error) {
            console.error(error);
        }
    };
    if(allScanned) {
        return <></>
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
            style={styles.scanner}
          />
          {scanned && (
            <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
          )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    scanner: {
      width: 500,
      height: 300,
      alignSelf: 'center',
    },
});
  

export default ScanMultipleQR;