import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Pressable, ScrollView } from 'react-native';
import AllDebtFormComponent from '@/components/ui/AllDebts';
import { useEffect, useState } from "react";
import { debtBill, expenseBill } from '@/api/apiInterface';
import { useAuth0 } from 'react-native-auth0';
import { GetDebtWithUser, GetAllDebtWithUser, GetUser } from "@/api/apiService";
import { router, useLocalSearchParams } from 'expo-router';



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


export default function debts() {
    const { user } = useAuth0();
    const [id, setId] = useState("");
    const { ConnectedId } = useLocalSearchParams();

    const [data, setData] = useState<debtBill[]>([]);
    const [total, setTotal] = useState(0);
    const [Firstname, setFirstName] = useState("");
    const [type, setType] = useState("");

    const [buttonText, setButtonText] = useState("Show all settled");

    useEffect(() => {
        if (user) {
            const Email = user.email ?? "";
            checkUserExists(Email)
                .then((userProfile) => {
                    if (userProfile) {
                        setId(userProfile._id);
                    }
                    const idAsString = Array.isArray(ConnectedId) ? ConnectedId[0] : ConnectedId;

                    GetDebtWithUser(userProfile._id, idAsString)
                        .then((result) => {
                            if (result) {
                                setData(result.debts);
                                setTotal(result.totalDue);
                                setFirstName(result.ConnectedName);
                                setType(result.debtType);
                            }
                        }
                        ).catch((error) => {
                            console.error("Error getting Debt data:", error);
                        });
                })
                .catch((error) => {
                    console.error("Error checking user existence:", error);
                });

        }
    }, [user]);

    const onPress = () => {
        if (buttonText === "Show all settled") {
            setButtonText("Collapse settled");
            const idAsString = Array.isArray(ConnectedId) ? ConnectedId[0] : ConnectedId;
            GetAllDebtWithUser(id, idAsString)
                .then((result) => {
                    if (result) {
                        setData(result.debts);
                        setTotal(result.totalDue);
                        setFirstName(result.ConnectedName);
                        setType(result.debtType);
                    }
                }
                ).catch((error) => {
                    console.error("Error getting Debt data:", error);
                });
        } else {
            setButtonText("Show all settled");
            const idAsString = Array.isArray(ConnectedId) ? ConnectedId[0] : ConnectedId;
            GetDebtWithUser(id, idAsString)
                .then((result) => {
                    if (result) {
                        setData(result.debts);
                        setTotal(result.totalDue);
                        setFirstName(result.ConnectedName);
                        setType(result.debtType);
                    }
                }
                ).catch((error) => {
                    console.error("Error getting Debt data:", error);
                });
        }


    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#A1CEDC" }}>
            <ThemedView style={{ flex: 1, backgroundColor: "#A1CEDC", marginTop: "10%", marginLeft: 20, marginRight: 20, flexDirection: "row", alignItems: "center", gap: 20, justifyContent: "space-between" }}>
                <ThemedText type="subtitle" >{Firstname} {type}</ThemedText>
                <ThemedText type="subtitle" >{total}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.container}>
                    {data.length > 0 ? (
                        <ScrollView style={styles.formContainer}>
                            {data.map((item) => (
                                <AllDebtFormComponent key={item._id} data={item} id={id} connectedId={Array.isArray(ConnectedId) ? ConnectedId[0] : ConnectedId} />
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
                style={[styles.buttonShadowBox, styles.Button, { marginBottom: 10 }]}
                onPress={onPress
                }
            >
                <ThemedText style={[styles.buttonText]}>{buttonText}</ThemedText>
            </Pressable>
            {type === "You owe" && (
                <Pressable
                    style={[styles.buttonShadowBox, styles.Button, { marginBottom: 10 }]}
                    onPress={() => {
                        router.push({
                            pathname: "/(debt)/pay",
                            params: { friendId: Array.isArray(ConnectedId) ? ConnectedId[0] : ConnectedId }
                        })
                    }
                    }
                >
                    <ThemedText style={[styles.buttonText]}>Pay</ThemedText>
                </Pressable>
            )}
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
        paddingTop: 0,
        backgroundColor: "#728e96",
        borderRadius: 8,
        marginTop: 10,
    },
    buttonShadowBox: {
        width: 200,
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
