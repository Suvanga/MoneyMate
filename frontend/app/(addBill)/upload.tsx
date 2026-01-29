import React, { useState } from "react";
import {
    StyleSheet,
    Pressable,
    TextInput,
    Image,
    View,
    Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Importing image picker
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { uploadReceiptImage } from "@/api/apiService";
import { router } from "expo-router";

export default function upload() {
    const [imageUri, setImageUri] = useState<string>();
    const [type, setType] = useState<string>();
    const [fileName, setFileName] = useState<string | null>();

    const [storeName, setStoreName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [itemData, setItemData] = useState<{ itemName: string, amount: string }[]>([]);


    // Function to pick an image from the gallery or camera
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setType(result.assets[0].type);
            setFileName(result.assets[0].fileName);
        }
    };

    const handleSubmit = async () => {
        if (!imageUri) {
            Alert.alert("Please select an image");
            return;
        }
        const imageFile = {
            uri: imageUri,
            type: type,
            fileName: fileName,
        };

        uploadReceiptImage(imageFile)
            .then((response) => {
                console.log(JSON.stringify(response.parseddata.items));
                setStoreName(response.parseddata.storeName);
                setItemData(response.parseddata.items);
                setAmount(response.parseddata.totalAmount);
                Alert.alert("Image uploaded successfully");
                router.push({
                    pathname: "/(addBill)/bill",
                    params: {
                        storeName: response.parseddata.storeName,
                        totalAmount: response.parseddata.totalAmount,
                        items: JSON.stringify(response.parseddata.items),
                    },
                });

            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                Alert.alert("Error uploading image");
            }
            );


    };

    return (
        <ThemedView style={{ flex: 1, backgroundColor: "#A1CEDC" }}>
            <Pressable style={[styles.buttonShadowBox, styles.Button, { marginTop: "30%" }]} onPress={pickImage}>
                <ThemedText style={[styles.buttonText]}>Pick an image</ThemedText>
            </Pressable>

            {imageUri && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>
            )}


            <ThemedView style={{ backgroundColor: "#A1CEDC", marginTop: "10%" }}>
                <Pressable
                    style={[styles.buttonShadowBox, styles.Button]}
                    onPress={handleSubmit}
                >
                    <ThemedText style={[styles.buttonText]}>Submit</ThemedText>
                </Pressable>
            </ThemedView>
            <ThemedView style={{ backgroundColor: "#A1CEDC", marginTop: "10%" }}>
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
    textInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: "10%",
        marginBottom: 20,
        width: "65%",
        backgroundColor: "#fff",
        color: "rgba(0, 0, 0, 0.65)",
        alignSelf: "center",
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
});
