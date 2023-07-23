import { View, Text, StyleSheet, Image, ImageBackground, Pressable } from "react-native";
// import styles from "./Material.module.css";
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

const MaterialScreen = ({navigation, router}) => {
    const material = router.params.material;
    const tableTitle = ["Barcode", "Equipment Details", "MOC", "Size", "Additional Details", "Minimum Qty"];
    const tableData = [[material.barcode, material.equipment_details, material.moc, material.size, material.additional_details, material.minimum_quantity]]
    return (
        <View style={styles.container}>
            {/* <Table borderStyle={{borderWidth: 1}}>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                    <Rows data={tableData} flexArr={[2]} style={styles.row} textStyle={styles.text}/>
                </TableWrapper>
            </Table>  */}
            
        </View>
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