import { Image, StyleSheet, Platform, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import { expenseBill, expenseBillItem } from '@/api/apiInterface';
import { useAuth0 } from 'react-native-auth0';
import { GetExpenseById, GetExpenseItemsById, UpdateExpense } from "@/api/apiService";
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import ItemFormComponent from '@/components/ui/ItemFormComponent';




export default function TransactionDetail() {
    const { user } = useAuth0();
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<expenseBill>();
    const [itemData, setItemData] = useState<expenseBillItem[]>([]);
    const [buttonText, setButtonText] = useState("Update");
    const [store, setStore] = useState("");
    const [amount, setAmount] = useState("");
    const [tax, setTax] = useState("");
    const [total, setTotal] = useState("");
    const [cardType, setCardType] = useState("");
    const [date, setDate] = useState("");

    const onPress = () => {
        if (buttonText === "Save") {
            const expenseBillData = {
                store: store,
                amount: parseFloat(amount),
                tip: parseFloat(tax),
                TotalAmount: parseFloat(total),
                CardType: cardType,
                date: date,
            };
            const expenseItemData = itemData.map((item) => ({
                ...item,
                itemName: item.itemName,
                quantity: item.quantity,
                amount: parseFloat(item.amount.toString()),
            }));
            const idAsString = Array.isArray(id) ? id[0] : id;

            console.log(JSON.stringify({ expenseBillData, expenseItemData }));
            UpdateExpense(idAsString, JSON.stringify({ expenseBillData, expenseItemData })).then(() => {
                setButtonText(prevState => prevState === "Update" ? "Save" : "Update");
            });
        }
        else if (buttonText === "Update") {
            setButtonText("Save");
        }

    }

    const handleItemChange = (updatedItem: expenseBillItem) => {
        setItemData((prevData) =>
            prevData.map((item) =>
                item._id === updatedItem._id ? updatedItem : item
            )
        );
    };

    useEffect(() => {
        if (user && typeof id === "string") {
            GetExpenseById(id).then((expenseData) => {
                setData(expenseData);
                setStore(expenseData.store);
                setAmount(expenseData.amount.toString());
                setTax(expenseData.tip.toString());
                setTotal(expenseData.TotalAmount.toString());
                setCardType(expenseData.CardType);
                setDate(expenseData.date.split("T")[0]);

            }
            ).catch((error) => {
                console.error("Error getting expense data:", error);
            }
            );

            GetExpenseItemsById(id).then((expenseItemData) => {
                setItemData(expenseItemData);

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
                                    editable={buttonText === "Save" ? true : false}
                                    onChangeText={(text) => setStore(text)}
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
                                    value={amount}
                                    editable={buttonText === "Save" ? true : false}
                                    onChangeText={(text) => setAmount(text)}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Tax:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={tax}
                                    editable={buttonText === "Save" ? true : false}
                                    onChangeText={(text) => setTax(text)}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Total:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={total}
                                    editable={buttonText === "Save" ? true : false}
                                    onChangeText={(text) => setTotal(text)}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Card Type:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={cardType}
                                    editable={buttonText === "Save" ? true : false}
                                    onChangeText={(text) => setCardType(text)}
                                />
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value="Date:"
                                    editable={false}
                                />
                            </ThemedView>

                            <ThemedView style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={date}
                                    editable={buttonText === "Save" ? true : false}
                                    onChangeText={(text) => setDate(text)}
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
                                <ItemFormComponent key={item._id} data={item} edit={buttonText === "Save" ? true : false} onItemChange={handleItemChange} />
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
                style={[styles.buttonShadowBox, styles.Button, { marginBottom: 10 }]}
                onPress={
                    onPress
                }
            >
                <ThemedText style={[styles.buttonText]}>{buttonText}</ThemedText>
            </Pressable>
            <Pressable
                style={[styles.buttonShadowBox, styles.Button]}
                onPress={() => {
                    router.push("/(tabs)");
                }
                }
            >
                <ThemedText style={[styles.buttonText]}>Home</ThemedText>
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
