import { Image, StyleSheet, Platform, TextInput, Alert, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import { connectedUsers, debtBill, debtBillItem } from '@/api/apiInterface';
import { useAuth0 } from 'react-native-auth0';
import { GetUser, GetUserByUserId, CreateDebt, CreateExpense } from "@/api/apiService";
import { router, useLocalSearchParams } from 'expo-router';
import SplitToSelector from '@/components/ui/checkbox';



const checkUserExists = async (email: string) => {
    try {
        const userProfile = await GetUser(email);
        return userProfile;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error("Error checking user existence:", error);
        throw error;
    }
};


export default function Bill() {
    const { user } = useAuth0();


    const params = useLocalSearchParams();


    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [BillName, setBillName] = useState("");
    const [store, setStore] = useState("");
    const [description, setDescription] = useState("");
    const [total, setTotal] = useState("");
    const [tip, setTip] = useState("0");
    const [connectedUser, setConnectedUser] = useState<connectedUsers[]>([]);
    const [billParticipant, seBillParticipant] = useState<string[]>([]);

    const [selectedUsers, setSelectedUsers] = useState([""]);



    const [formItems, setFormItems] = useState([
        {
            id: Date.now(),
            name: '',
            amount: '',
            currency: 'USD',
            quantity: '1',
            splitTo: ['']
        },
    ]);



    const handleAddForm = () => {
        setFormItems((prev) => [...prev, { id: Date.now(), name: '', amount: '', currency: 'USD', quantity: '', splitTo: [''] }]);
    };

    const handleRemoveLastForm = () => {
        setFormItems((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    const onSubmit = () => {

        if (!BillName || !store || !total || !userName) {
            Alert.alert("Please fill in all required fields marked *.");
        }
        else {
            //For debt
            const participant = selectedUsers.map(userId => ({ person: userId }));

            const debtBillData = {
                name: BillName,
                amount: total,
                description: description,
                lender: userId,
                ...(formItems.length === 0
                    ? billParticipant
                        .filter((userId) => userId && userId.trim() !== "")
                        .map((userId) => ({ person: userId })).length > 0 && {
                        participant: billParticipant
                            .filter((userId) => userId && userId.trim() !== "")
                            .map((userId) => ({ person: userId })),
                    }
                    : [...new Set(formItems.flatMap((item) => item.splitTo))]
                        .filter((userId) => userId && userId.trim() !== "")
                        .map((userId) => ({ person: userId })).length > 0 && {
                        participant: [...new Set(formItems.flatMap((item) => item.splitTo))]
                            .filter((userId) => userId && userId.trim() !== "")
                            .map((userId) => ({ person: userId })),
                    }),
            };
            const debtItemData = formItems.map(item => {
                const borrowers = item.splitTo.filter(userId => userId && userId.trim() !== "");
                return {
                    item: item.name,
                    amount: item.amount,
                    ...(borrowers.length > 0 && { borrower: borrowers.map(userId => ({ person: userId })) })
                }

            });

            //For expense
            const expenseBillData = {
                user: userId,
                store: store,
                amount: parseFloat(total) - parseFloat(tip),
                CardType: "N/A",
                currency: "USD",
                tip: tip,
                TotalAmount: total,
            };
            const expenseItemData = formItems.map(item => ({
                itemName: item.name,
                quantity: item.quantity,
                amount: item.amount,
            }));

            console.log("Debt", JSON.stringify(debtBillData));
            console.log("Item", JSON.stringify(debtItemData));
            if (expenseItemData.length === 0) {
                if (!debtBillData.participant || debtBillData.participant.length === 0) {
                    CreateExpense(expenseBillData, [])
                        .then((result) => {
                            if (result) {
                                console.log("Expense created successfully:", result);
                                router.push("/complete");
                            }
                        })
                        .catch((error) => {
                            console.error("Error creating expense:", error);
                        });
                }
                else {
                    //Create debt and expense
                    CreateDebt(debtBillData, [])
                        .then((result) => {
                            if (result) {
                                console.log("Expense", expenseBillData);
                                console.log("Item", expenseItemData);
                                CreateExpense(expenseBillData, [])
                                    .then((result) => {
                                        if (result) {
                                            console.log("Expense created successfully:", result);
                                            router.push("/complete");
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Error creating expense:", error);
                                    });
                            }
                        }
                        ).catch((error) => {
                            console.error("Error creating debt:", error);
                        });
                }
            }
            else {
                if (!debtBillData.participant || debtBillData.participant.length === 0) {
                    CreateExpense(expenseBillData, expenseItemData)
                        .then((result) => {
                            if (result) {
                                console.log("Expense created successfully:", result);
                                router.push("/complete");
                            }
                        })
                        .catch((error) => {
                            console.error("Error creating expense:", error);
                        });
                }
                else {
                    //Create debt and expense
                    CreateDebt(debtBillData, debtItemData)
                        .then((result) => {
                            if (result) {
                                console.log("Expense", expenseBillData);
                                console.log("Item", expenseItemData);
                                CreateExpense(expenseBillData, expenseItemData)
                                    .then((result) => {
                                        if (result) {
                                            console.log("Expense created successfully:", result);
                                            router.push("/complete");
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Error creating expense:", error);
                                    });
                            }
                        }
                        ).catch((error) => {
                            console.error("Error creating debt:", error);
                        });
                }
            }
        }
    };

    useEffect(() => {
        if (user) {
            const Email = user.email ?? "";
            checkUserExists(Email)
                .then((userProfile) => {
                    if (userProfile) {
                        GetUserByUserId(userProfile._id).then((userP) => {
                            if (userP) {
                                setUserId(userProfile._id);
                                setUserName(userP.username);
                                setConnectedUser(userP.connectedUsers);
                                setConnectedUser((prevUsers) => [...prevUsers, userProfile]);
                            }
                        });

                    }
                })
                .catch((error) => {
                    console.error("Error checking user existence:", error);
                });


            if ('storeName' in params) {
                setStore(params.storeName as string);
            }
            if ('totalAmount' in params) {
                setTotal(params.totalAmount as string);
            }
            if ('items' in params) {
                const parsedItems = JSON.parse(params.items as string);

                setFormItems(parsedItems.map((item: any, index: number) => ({
                    id: `${Date.now()}-${index}`,
                    name: item.itemName ?? '',
                    amount: String(item.amount) ?? '',
                    currency: 'USD',
                    quantity: item.quantity ?? '1',
                    splitTo: ['']
                })));
            }

        }
    }, [user]);


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#A1CEDC" }}>
            <ThemedText type="subtitle" style={{ marginTop: "10%", marginLeft: 20 }}>Bill</ThemedText>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.container}>

                    <ThemedView style={styles.formContainer}>
                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Bill Name*:"
                                editable={false}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={BillName}
                                editable={true}
                                onChangeText={(text) => setBillName(text)}
                            />
                        </ThemedView>
                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Store*:"
                                editable={false}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={store}
                                editable={true}
                                onChangeText={(text) => setStore(text)}
                            />
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Currency:"
                                editable={false}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={"USD"}
                                editable={false}
                            />

                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Total*:"
                                editable={false}
                            />

                            <TextInput
                                style={styles.textInput}
                                value={total}
                                editable={true}
                                onChangeText={(text) => setTotal(text)}
                            />

                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Description:"
                                editable={false}
                            />
                            <TextInput
                                style={styles.textInput}
                                value={description}
                                editable={true}
                                onChangeText={(text) => setDescription(text)}
                            />
                        </ThemedView>
                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Tip:"
                                editable={false}
                            />

                            <TextInput
                                style={styles.textInput}
                                value={tip}
                                editable={true}
                                onChangeText={(text) => setTip(text)}
                            />
                        </ThemedView>

                        <ThemedView style={styles.form}>
                            <TextInput
                                style={styles.input}
                                value="Paid By*:"
                                editable={false}
                            />

                            <TextInput
                                style={styles.textInput}
                                value={userName}
                                editable={false}
                            />
                        </ThemedView>
                        {formItems.length === 0 && (
                            <ThemedView style={styles.form}>
                                <TextInput
                                    style={styles.input}
                                    value="Split to:"
                                    editable={false}
                                />

                                <SplitToSelector data={connectedUser} onChangeSelected={(selectedUsers) =>
                                    seBillParticipant(selectedUsers)
                                } />
                            </ThemedView>
                        )}
                    </ThemedView>

                </ThemedView>
            </ThemedView>
            <ThemedText type="subtitle" style={{ marginTop: "10%", marginLeft: 20 }}>Items</ThemedText>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.container}>
                    {formItems.length > 0 ? (
                        <ThemedView style={styles.formContainer}>
                            {formItems.map((item) => (
                                <ThemedView key={item.id} style={{ marginBottom: 10 }}>
                                    <ThemedView style={styles.form}>
                                        <TextInput
                                            style={styles.input}
                                            value="Item Name*:"
                                            editable={false}
                                        />

                                        <TextInput
                                            style={styles.textInput}
                                            value={item.name}
                                            editable={true}
                                            onChangeText={(text) => setFormItems((prev) => prev.map((i) => i.id === item.id ? { ...i, name: text } : i))}

                                        />
                                    </ThemedView>
                                    <ThemedView style={styles.form}>
                                        <TextInput
                                            style={styles.input}
                                            value="Amount*:"
                                            editable={false}
                                        />

                                        <TextInput
                                            style={styles.textInput}
                                            value={item.amount}
                                            editable={true}
                                            onChangeText={(text) => setFormItems((prev) => prev.map((i) => i.id === item.id ? { ...i, amount: text } : i))}
                                        />
                                    </ThemedView>
                                    <ThemedView style={styles.form}>
                                        <TextInput
                                            style={styles.input}
                                            value="Currency*:"
                                            editable={false}
                                        />

                                        <TextInput
                                            style={styles.textInput}
                                            value={item.currency}
                                            editable={false}
                                        />
                                    </ThemedView>
                                    <ThemedView style={styles.form}>
                                        <TextInput
                                            style={styles.input}
                                            value="Quantity:"
                                            editable={false}
                                        />

                                        <TextInput
                                            style={styles.textInput}
                                            value={item.quantity}
                                            editable={true}
                                            onChangeText={(text) => setFormItems((prev) => prev.map((i) => i.id === item.id ? { ...i, quantity: text } : i))}
                                        />
                                    </ThemedView>
                                    <ThemedView style={styles.form}>
                                        <TextInput
                                            style={styles.input}
                                            value="Split to:"
                                            editable={false}
                                        />

                                        <SplitToSelector data={connectedUser} onChangeSelected={(updatedId) =>
                                            setFormItems((prev) =>
                                                prev.map((i) =>
                                                    i.id === item.id ? { ...i, splitTo: updatedId.filter((id) => id && id.trim() !== "") } : i
                                                )
                                            )
                                        } />


                                    </ThemedView>
                                </ThemedView>
                            ))}
                        </ThemedView>
                    ) : (
                        <ThemedView style={styles.row}>
                            <ThemedText>No Items</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
            </ThemedView>
            <ThemedView style={{ backgroundColor: '#A1CEDC', flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                <Pressable
                    style={[styles.buttonShadowBox, styles.Button]}
                    onPress={handleRemoveLastForm
                    }
                >
                    <ThemedText style={[styles.buttonText]}>Remove Item</ThemedText>
                </Pressable>

                <Pressable
                    style={[styles.buttonShadowBox, styles.Button]}
                    onPress={handleAddForm
                    }
                >
                    <ThemedText style={[styles.buttonText]}>Add Item</ThemedText>
                </Pressable>
            </ThemedView>
            <Pressable
                style={[styles.buttonShadowBox, styles.Button]}
                onPress={onSubmit
                }
            >
                <ThemedText style={[styles.buttonText]}>Submit</ThemedText>
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
    textInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20,
        width: "60%",
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.65)",
    },
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
    container: {
        justifyContent: "center",
        padding: 7,
        paddingTop: 3,
        backgroundColor: "#728e96",
        borderRadius: 8,
        marginTop: 10,
    },
    buttonShadowBox: {
        width: 120,
        backgroundColor: "#fff",
        borderRadius: 8,
        height: 30,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 20,
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
        paddingLeft: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        paddingLeft: 8,
        width: 120,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
});
