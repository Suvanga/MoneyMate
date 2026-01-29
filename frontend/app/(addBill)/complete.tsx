import { View, Pressable, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { router } from "expo-router";


import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


export default function Complete() {


    return (
        <ThemedView style={styles.nameForm}>

            <ThemedView style={{ backgroundColor: "#8fc5d6", marginTop: "60%", marginBottom: 30 }}>
                <ThemedText style={[styles.formtitle]}>
                    Bill added successfully
                </ThemedText>
            </ThemedView>
            <ThemedView style={{ backgroundColor: "#8fc5d6" }}>
                <Pressable
                    style={[styles.buttonShadowBox, styles.Button]}
                    onPress={() => {
                        router.push("/(tabs)");
                    }
                    }
                >
                    <ThemedText style={[styles.buttonText]}>Home</ThemedText>
                </Pressable>
            </ThemedView>

        </ThemedView>
    );
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

    image1: {
        top: 0,
        left: 0,
        borderTopLeftRadius: 214,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 214,
        borderStyle: "solid",
        borderColor: "rgba(0, 0, 0, 0)",
        borderWidth: 1,
        width: width,
        height: height,
        backgroundColor: "transparent",
        position: "absolute",
    },

    formtitle: {
        top: "27%",
        alignSelf: "center",
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        color: "rgba(0, 0, 0, 0.65)",
        textAlign: "center",
        alignItems: "center",
        fontSize: 20,
    },
    nameForm: {
        backgroundColor: "#8fc5d6",
        flex: 1,
        height: 956,
        overflow: "hidden",
        width: "100%",
        flexDirection: "column",
    },
});
