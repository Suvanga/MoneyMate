import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { debtBill } from "@/api/apiInterface";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";


const AllDebtFormComponent = ({ data, id, connectedId }: { data: debtBill, id: string, connectedId: string }) => {
    const [debtType, setDebtType] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (id === data.lender._id) {
            setDebtType("Owes you");
            setAmount(data.participant.find(participant => participant.person._id === connectedId)?.due || 0);
        }
        else if (
            data.participant?.some(participant => participant.person._id === id)
        ) {
            setDebtType("You owe");
            setAmount(data.participant.find(participant => participant.person._id === id)?.due || 0);
        }
        else {
            setDebtType("Settled");
        }



    }
        , [id]);

    return (
        <Pressable onPress={() => {
            router.push({
                pathname: "/(debt)/debtDetail",
                params: { Billid: data._id }
            })
        }}>
            <ThemedView style={styles.form}>
                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={data?.name}
                        editable={false}
                        pointerEvents="none"
                    />
                    <TextInput
                        style={styles.inputDate}
                        value={data?.createdAt.split("T")[0]}
                        editable={false}
                        pointerEvents="none"
                    />
                </ThemedView>

                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputDate}
                        value={debtType}
                        editable={false}
                        pointerEvents="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={`$${String(amount)}`}
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

export default AllDebtFormComponent;
