import { Image, StyleSheet, Platform, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import { debtBill, debtBillItem, participantDebtBill } from '@/api/apiInterface';
import { useAuth0 } from 'react-native-auth0';
import { GetDebtById, GetDebtItemsById, UpdateExpense } from "@/api/apiService";
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ItemFormComponent from '@/components/ui/ItemFormComponent';
import DebtItemFormComponent from '@/components/ui/DebItems';




export default function DebtDetail() {
    const { user } = useAuth0();
    const { Billid } = useLocalSearchParams();

    const [data, setData] = useState<debtBill>();
    const [itemData, setItemData] = useState<debtBillItem[]>([]);
    const [buttonText, setButtonText] = useState("Update");
    const [store, setStore] = useState("");
    const [description, setDescription] = useState("");
    const [total, setTotal] = useState("");
    const [participant, setParticipant] = useState<participantDebtBill[]>([]);
    const [date, setDate] = useState("");


    useEffect(() => {
        if (user && typeof Billid === "string") {
            GetDebtById(Billid).then((DebtData) => {
                setData(DebtData);
                setStore(DebtData.name);
                setTotal(DebtData.amount.toString());
                setDescription(DebtData.description);
                setDate(DebtData.updatedAt.split("T")[0]);
                setParticipant(DebtData.participant);
            }
            ).catch((error) => {
                console.error("Error getting Debt data:", error);
            }
            );

            GetDebtItemsById(Billid).then((DebtItemData) => {
                setItemData(DebtItemData);

            }
            ).catch((error) => {
                console.error("Error getting expense data:", error);
            }
            );
        }
    }, [user]);


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#A1CEDC" }}>
            <ThemedText type="subtitle" style={{ marginTop: "10%", marginLeft: 20 }}>Bill</ThemedText>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.container}>

                    <ThemedView style={styles.formContainer}>
                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Store:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={store}
                                    editable={false}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Currency:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={data?.currency}
                                    editable={false}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Amount:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={total}
                                    editable={false}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Description:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={description}
                                    editable={false}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Created:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={date}
                                    editable={false}
                                />
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                </ThemedView>
            </ThemedView>
            <ThemedText type="subtitle" style={{ marginTop: "10%", marginLeft: 20 }}>Items</ThemedText>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.container}>
                    {itemData.length > 0 ? (
                        <ThemedView style={styles.formContainer}>
                            {itemData.map((item) => (
                                <DebtItemFormComponent key={item._id} data={item} />
                            ))}
                        </ThemedView>
                    ) : (
                        <ThemedView style={styles.row}>
                            <ThemedText>No history found</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
            </ThemedView>

            <Pressable
                style={[styles.buttonShadowBox, styles.Button]}
                onPress={() => {
                    router.push("/(tabs)/friends");
                }
                }
            >
                <ThemedText style={[styles.buttonText]}>Friends</ThemedText>
            </Pressable>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    formContainer: {
        width: "100%",
        backgroundColor: "#728e96",
        borderRadius: 8,
    },

    row: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    container: {
        justifyContent: "center",
        padding: 7,
        paddingTop: 3,
        backgroundColor: "#728e96",
        borderRadius: 8,
        marginTop: 10,
    },
    buttonShadowBox: {
        width: 100,
        backgroundColor: "#fff",
        borderRadius: 8,
        height: 30,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 50,
        shadowOpacity: 1,
        elevation: 4,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowColor: "rgba(0, 0, 0, 0.25)",
    },
    buttonText: {
        color: "rgba(0, 0, 0, 0.65)",
        fontSize: 15,
        lineHeight: 25,
        textAlign: "center",
    },
    Button: {
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    form: {
        marginBottom: 0,
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
});
