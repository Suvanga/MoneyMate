import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { connectedUsers } from '@/api/apiInterface';


type SplitToSelectorProps = {
    data: connectedUsers[];
    onChangeSelected: (selected: string[]) => void;
};


export default function SplitToSelector({ data, onChangeSelected }: SplitToSelectorProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);

    const toggleUser = (user: connectedUsers) => {
        const updated = selectedUsers.includes(user.username)
            ? selectedUsers.filter((u) => u !== user.username)
            : [...selectedUsers, user.username];

        setSelectedUsers(updated);

        const updatedId = selectedId.includes(user._id)
            ? selectedId.filter((u) => u !== user._id)
            : [...selectedId, user._id];
        setSelectedId(updatedId);
        onChangeSelected(updatedId);
    };

    return (
        <ThemedView style={styles.input}>
            <ScrollView style={{ maxHeight: 200 }}>
                {data.map((user) => (
                    <Checkbox.Item
                        key={user._id}
                        label={user.username}
                        status={selectedUsers.includes(user.username) ? 'checked' : 'unchecked'}
                        onPress={() => toggleUser(user)}
                    />
                ))}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    form: {
        marginBottom: 0,
        paddingLeft: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 80,
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
})