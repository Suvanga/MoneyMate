import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable, ScrollView } from 'react-native';
import FormComponent from '@/components/ui/FormComponent';
import { useEffect, useState } from "react";
import { expenseBill } from '@/api/apiInterface';
import { useAuth0 } from 'react-native-auth0';
import { GetExpense, GetUser } from "@/api/apiService";
import { router } from 'expo-router';



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


export default function Transactions() {
    const { user } = useAuth0();

    const [data, setData] = useState<expenseBill[]>([]);

    useEffect(() => {
        if (user) {
            const Email = user.email ?? "";
            checkUserExists(Email)
                .then((userProfile) => {
                    GetExpense(userProfile._id)
                        .then((expenseData) => {
                            if (expenseData) {
                                setData(expenseData);
                            }
                        }
                        ).catch((error) => {
                            console.error("Error getting expense data:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error checking user existence:", error);
                });

        }
    }, [user]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#A1CEDC" }}>
            <ThemedText type="subtitle" style={{ marginTop: "10%", marginLeft: 20 }}>Expense History</ThemedText>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.container}>
                    {data.length > 0 ? (
                        <ScrollView style={styles.formContainer}>
                            {data.map((item) => (
                                <FormComponent key={item._id} data={item} />
                            ))}
                        </ScrollView>
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
        paddingTop: 0,
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
        marginBottom: 10,
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
        marginBottom: 50,
    },
});
