import React, { useState } from 'react';
import { Pressable, View, Modal, Text, StyleSheet } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from './IconSymbol';
import { router } from 'expo-router';

export function AddButton(props: any) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <Pressable
                {...props}
                onPress={() => setModalVisible(true)}
                style={({ pressed }) => [
                    { opacity: pressed ? 0.6 : 1 },
                    props.style,
                ]}
            >
                {props.children}
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <ThemedView style={styles.modalOverlay}>
                    <ThemedView style={styles.modalContent}>
                        <ThemedView style={styles.titleContainer}>
                            <IconSymbol
                                name="camera.fill"
                                size={30}
                                color="rgba(0, 0, 0, 0.65)"
                                style={{ marginRight: 8 }}
                            />
                            <ThemedText style={styles.option} onPress={() => { setModalVisible(false); router.push("/(addBill)/camera") }}>
                                Scan Bill
                            </ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.titleContainer}>
                            <IconSymbol
                                name="square.and.arrow.up.circle.fill"
                                size={30}
                                color="rgba(0, 0, 0, 0.65)"
                                style={{ marginRight: 8 }}
                            />
                            <ThemedText style={styles.option} onPress={() => { setModalVisible(false); router.push("/(addBill)/upload"); }}>
                                Upload Bill
                            </ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.titleContainer}>
                            <IconSymbol
                                name="pencil.circle.fill"
                                size={30}
                                color="rgba(0, 0, 0, 0.65)"
                                style={{ marginRight: 8 }}
                            />
                            <ThemedText style={styles.option} onPress={() => { setModalVisible(false); router.push("/(addBill)/bill"); }}>
                                Add Manually
                            </ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.titleContainer}>
                            <IconSymbol
                                name="xmark.circle.fill"
                                size={30}
                                color="rgba(0, 0, 0, 0.65)"
                                style={{ marginRight: 8 }}

                            />
                            <ThemedText style={styles.option} onPress={() => setModalVisible(false)}>
                                Cancel
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    modalContent: {
        backgroundColor: '#EEFCFF',
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    option: {
        fontSize: 18,
        paddingVertical: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});