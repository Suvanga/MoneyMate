import {
    StyleSheet,
    Pressable,
    TextInput,
} from "react-native";
import { useEffect, useState } from "react";


import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth0 } from "react-native-auth0";
import { GetUser, CreatePayment } from "@/api/apiService";
import { router, useLocalSearchParams } from "expo-router";


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



export default function Pay() {
    const { user } = useAuth0();

    const [id, setId] = useState("");
    const [amount, setAmount] = useState("");
    const { friendId } = useLocalSearchParams();
    const connectedId = Array.isArray(friendId) ? friendId[0] : friendId;
    useEffect(() => {
        if (user) {
            const Email = user.email ?? "";
            checkUserExists(Email)
                .then((userProfile) => {
                    if (userProfile) {
                        setId(userProfile._id);
                    }

                })
                .catch((error) => {
                    console.error("Error checking user existence:", error);
                });
        }
    }, [user]);

    const handlePayment = async (id: string, connectedId: string, amount: string) => {
        console.log("ID", id);
        console.log("Connected ID", connectedId);
        console.log("Amount", amount);

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            console.error("Invalid amount");
            return;
        }
        CreatePayment({ payerId: id, payeeId: connectedId, amount: parsedAmount })
            .then((response) => {
                if (response) {
                    console.log("Payment successful:", response);
                    router.push("/(debt)/complete");
                }
            })
            .catch((error) => {
                console.error("Error creating payment:", error);
            });

    }

    return (
        <ThemedView style={{ flex: 1, backgroundColor: "#A1CEDC" }}>
            <TextInput
                style={styles.textInput}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                editable={true}
                selectTextOnFocus={true}
                onChangeText={(text) => {
                    setAmount(text);
                }}
            />
            <ThemedView style={{ backgroundColor: "#A1CEDC" }}>
                <Pressable
                    style={[styles.buttonShadowBox, styles.Button]}
                    onPress={() => {
                        handlePayment(id, connectedId, amount)
                    }
                    }
                >
                    <ThemedText style={[styles.buttonText]}>Submit</ThemedText>
                </Pressable>
            </ThemedView>

        </ThemedView>);
}

const styles = StyleSheet.create({
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
    buttonShadowBox: {
        width: 150,
        backgroundColor: "#fff",
        borderRadius: 8,
        alignSelf: "center",
        shadowOpacity: 1,
        elevation: 4,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowColor: "rgba(0, 0, 0, 0.25)",

    },
    textInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: "50%",
        marginBottom: 20,
        width: "65%",
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.65)",
        alignSelf: "center",
    },
});
