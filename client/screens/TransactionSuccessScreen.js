import { View, Text, StyleSheet, Image, ImageBackground, Pressable, ScrollView, Alert } from "react-native";
import stylesModule from "./Material.module.css";
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
import DropDown from "react-native-paper-dropdown";
import {useState} from "react";
import { Button, TextInput } from "react-native-paper";
import useAuthContext from "../hooks/useAuthContext";

const InputTransaction = (order, material) => {
    const tableTitle = ["Order Type", "Material Barcode", "Quantity", "Manufacturer test certificate", "SVE tested"];
    const tableData = [order.type, material.barcode, order.quantity, order.manufacturer_test_certificate_available ? "Available" : "Unavailable", order.sve_tested_material ? "Yes" : "No"]
    

    return (
        <ScrollView>
        <View style={styles.container}>
            <Table borderStyle={{borderWidth: 1}}>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[100, 100, 100, 100, 100]} textStyle={styles.text}/>
                    <Col data={tableData} style={styles.title} heightArr={[100, 100, 100, 100, 100]} textStyle={styles.text}/>
                </TableWrapper>
            </Table>
        </View>
        </ScrollView>
        
    )
}

const OutputTransaction = (order, material) => {
    const tableTitle = ["Order Type", "Material Barcode", "Quantity", "Company", "Project", "Material Provided to"];
    const tableData = [order.type, material.barcode, order.quantity, order.company_name, order.project_name, order.material_provided_to]
    

    return (
        <ScrollView>
        <View style={styles.container}>
            <Table borderStyle={{borderWidth: 1}}>
                <TableWrapper style={styles.wrapper}>
                    <Col data={tableTitle} style={styles.title} heightArr={[100, 100, 100, 100, 100]} textStyle={styles.text}/>
                    <Col data={tableData} style={styles.title} heightArr={[100, 100, 100, 100, 100]} textStyle={styles.text}/>
                </TableWrapper>
            </Table>
        </View>
        </ScrollView>
        
    )
}
const TransactionSuccessScreen = ({navigation, route}) => {
    const data = route.params.data;
    const order = data.order;
    const material = data.material;
    let transactionPane = <></>;
    if(order.type === "input") {
        // return <InputTransaction />
        transactionPane = InputTransaction(order, material);
    } else if(order.type === "output") {
        // return <OutputTransaction />
        transactionPane = OutputTransaction(order, material);
    }

    return (
        <ScrollView>
            {transactionPane}
            <View>
                <Pressable
                    onPress={() => {
                        navigation.navigate("dashboard")
                    }}
                >
                    <View>
                        <Text>Go to dashboard</Text>
                    </View>
                </Pressable>
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

export default TransactionSuccessScreen;