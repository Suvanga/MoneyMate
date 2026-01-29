import React from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { expenseBillItem } from "@/api/apiInterface";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";
import { useState } from "react";

const ItemFormComponent = ({ data, edit, onItemChange }: { data: expenseBillItem, edit: boolean, onItemChange: (updatedItem: expenseBillItem) => void }) => {
    const [itemName, setItemName] = useState(data.itemName);
    const [quantity, setQuantity] = useState(data.quantity.toString());
    const [amount, setAmount] = useState(data.amount.toString());

    const handleNameChange = (name: string) => {
        setItemName(name);
        updateParentData(name, quantity, amount);
    };

    const handleQuantityChange = (qty: string) => {
        setQuantity(qty);
        updateParentData(itemName, qty, amount);
    };

    const handleAmountChange = (amt: string) => {
        setAmount(amt);
        updateParentData(itemName, quantity, amt);
    };

    const updateParentData = (name: string, qty: string, amt: string) => {
        // Update the parent with the new data
        onItemChange({
            ...data,
            itemName: name,
            quantity: parseInt(qty),
            amount: parseFloat(amt),
        });
    };

    return (

        <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={itemName}
                    editable={edit}
                    onChangeText={handleNameChange}
                />
                <ThemedView style={[styles.inputQty, { flexDirection: 'row', gap: 5 }]}>
                    <TextInput
                        // style={styles.inputQty}
                        value={`Qty: `}
                        editable={false}
                    />
                    <TextInput
                        // style={styles.inputQty}
                        value={quantity}
                        editable={edit}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                    />
                </ThemedView>

            </ThemedView>

            <ThemedView style={[styles.inputContainer, { flexDirection: 'row', }]}>
                <TextInput
                    // style={styles.input}
                    value={`$`}
                    editable={false}
                />
                <TextInput
                    // style={styles.input}
                    value={amount}
                    editable={edit}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                />
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    form: {
        marginBottom: 5,
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: "35%",
    },
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: "auto",
        marginLeft: "auto",
    },
    label: {
        fontSize: 16,
        marginRight: 5,
    },
    input: {
        height: 30,
        marginBottom: 10,
        paddingLeft: 8,
        width: 120,
    },
    inputQty: {
        height: 15,
        marginBottom: 10,
        paddingLeft: 8,
        width: 100,
    },
});

export default ItemFormComponent;
