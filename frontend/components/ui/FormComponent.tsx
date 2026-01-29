import React from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { expenseBill } from "@/api/apiInterface";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";

const FormComponent = ({ data }: { data: expenseBill }) => {
    return (
        <Pressable onPress={() => {
            router.push({
                pathname: "/(transaction)/detail",
                params: { id: data._id }
            })
        }}>
            <ThemedView style={styles.form}>
                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={data.store}
                        editable={false}
                        pointerEvents="none"
                    />
                    <TextInput
                        style={styles.inputDate}
                        value={data.date ? data.date.split("T")[0] : ""}
                        editable={false}
                        pointerEvents="none"
                    />
                </ThemedView>

                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={`$${String(data.TotalAmount)}`}
                        editable={false}
                        pointerEvents="none"
                    />
                </ThemedView>
            </ThemedView>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    form: {
        marginBottom: 5,
        padding: 10,
        flexDirection: 'row', // Arrange the form fields horizontally
        flexWrap: 'wrap', // Allow fields to wrap if needed
        gap: "30%", // Space between form items
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

export default FormComponent;
