import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { debtBill, debtBillItem } from "@/api/apiInterface";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";


const DebtItemFormComponent = ({ data }: { data: debtBillItem }) => {

    return (
        <ThemedView style={[{ flex: 1, flexDirection: "column", marginBottom: 5, padding: 10, borderRadius: 8 }]}>
            <ThemedView style={[styles.form]}>
                <TextInput
                    style={styles.input}
                    value={data?.item}
                    editable={false}
                    pointerEvents="none"
                />
                <TextInput
                    style={styles.input}
                    value={`$${String(data?.amount)}`}
                    editable={false}
                    pointerEvents="none"
                />
            </ThemedView>
            {data?.borrower.length > 0 ? (
                data?.borrower.map((borrower) => (
                    <ThemedView key={borrower.person._id} style={[styles.form]}>
                        <TextInput
                            style={styles.input}
                            value={borrower.person.firstname + " " + borrower.person.lastname}
                            editable={false}
                            pointerEvents="none"
                        />
                        <TextInput
                            style={styles.input}
                            value={`Due $${String(borrower?.due)}`}
                            editable={false}
                            pointerEvents="none"
                        />
                        <TextInput
                            style={styles.input}
                            value={`Paid $${String(borrower?.paid)}`}
                            editable={false}
                            pointerEvents="none"
                        />

                    </ThemedView>
                ))) : (
                <ThemedView style={[styles.form]}>
                    <TextInput
                        style={styles.input}
                        value={"No Borrower"}
                        editable={false}
                        pointerEvents="none"
                    />
                </ThemedView>
            )}

        </ThemedView>

    );
};

const styles = StyleSheet.create({
    form: {
        marginBottom: 5,
        padding: 5,
        flexDirection: 'row', // Arrange the form fields horizontally
        flexWrap: 'wrap', // Allow fields to wrap if needed
        gap: "10%", // Space between form items
    },
    inputContainer: {
        flexDirection: 'column', // Align label and input horizontally
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: "auto", // Space between form items
        marginLeft: "auto", // Space between form items
    },
    label: {
        fontSize: 16,
        marginRight: 5, // Space between label and input
    },
    input: {
        height: 30,
        marginBottom: 10,
        paddingLeft: 8,
        width: 100, // Limit input width for better layout
    },
    inputDate: {
        height: 15,
        marginBottom: 10,
        paddingLeft: 8,
        width: 100, // Limit input width for better layout
    },
});

export default DebtItemFormComponent;
