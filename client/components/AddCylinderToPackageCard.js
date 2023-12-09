import { View, StyleSheet } from "react-native";
import { Card } from 'react-native-elements';
import { Button, TextInput } from "react-native-paper";
import styles from "./AddCylinderToPackageCard.module.css";


const AddCylinderToPackageCard = (props) => {

    return (
    <Card title={props.barcode}>
        <TextInput
            style={styles.inputStyle}
            editable={props.isNew}
            value={props.barcode}
        />
        <Button>
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