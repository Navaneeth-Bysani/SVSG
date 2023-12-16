import { View, StyleSheet, Button, TextInput, Text } from "react-native";
import { Card } from 'react-native-elements';
// import { Button, TextInput } from "react-native-paper";
import styles from "./AddCylinderToPackageCard.module.css";
import { useState } from "react";

const AddCylinderToPackageCard = (props) => {
    const [barcode, setBarcode] = useState("");

    return (
    <Card title={props.barcode}>
        <TextInput
            style={styles.inputStyle}
            editable={props.isNew}
            value={barcode}
            onChangeText={setBarcode}
        />
        <Text>{props.index}</Text>
        <Button
            title="Add"
            onPress={() => props.addBarcodes(props.index, barcode)}
        >
            Add
        </Button>
    </Card>
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
export default AddCylinderToPackageCard;