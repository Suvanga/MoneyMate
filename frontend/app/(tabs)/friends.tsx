import { Image, StyleSheet, Platform, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GetDebtWithAllConnectedUser, GetUser, GetUserByUsername, UpdateUser } from "@/api/apiService";
import { useAuth0 } from "react-native-auth0";
import { useEffect, useState } from "react";
import { Collapsible } from '@/components/Collapsible';
import DebtSummaryForm from '@/components/ui/DebtSummaryForm';
import { ScrollView } from 'react-native';
import { debtSummary, UserInfo } from '@/api/apiInterface';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { TextInput } from 'react-native';




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

export default function Friends() {

  const { user } = useAuth0();
  const [data, setData] = useState<debtSummary[]>([]);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserInfo>();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<UserInfo>();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredFriends(undefined); // Clear the filtered friends if the search query is empty
      return;
    }
    GetUserByUsername(query.toLowerCase())
      .then((response) => {
        if (response) {
          setFilteredFriends(response);
        }
      })
      .catch((error) => {
      });
  };


  const handleAddFriend = (friend: UserInfo) => {
    console.log(`Add friend with ID: ${friend._id}`);
    if (userProfile) {
      const updatedFriend: UserInfo = {
        _id: friend._id,
        username: friend.username,
        email: friend.email,
        firstname: friend.firstname,
        lastname: friend.lastname,
        connectedUsers: [...friend.connectedUsers, userProfile._id]
      }
      UpdateUser(friend._id, updatedFriend)
        .then(() => {
          console.log("user added to friend successfully");

        }
        ).catch((error) => {
          console.error("Error adding user to friend:", error);
        });

      const updatedUser: UserInfo = {
        _id: userProfile._id,
        username: userProfile.username,
        email: userProfile.email,
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        connectedUsers: [...userProfile.connectedUsers, friend._id]
      }
      UpdateUser(userProfile._id, updatedUser)
        .then(() => {
          console.log("Friend added to user successfully");

        }
        ).catch((error) => {
          console.error("Error adding friend to user:", error);
        });
    }

  };


  useEffect(() => {
    if (user) {
      const Email = user.email ?? "";
      checkUserExists(Email)
        .then((userProfile) => {
          if (userProfile) {
            setUserProfile(userProfile);
            const borrowerIds = userProfile.connectedUsers;
            GetDebtWithAllConnectedUser(userProfile._id, borrowerIds)
              .then((expenseData) => {
                if (expenseData) {
                  setData(expenseData.result);
                }
              }
              ).catch((error) => {
                console.error("Error getting expense data:", error);
              }
              );
          }
        })
        .catch((error) => {
          console.error("Error checking user existence:", error);
        });

    }
  }, [user]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/Moneymate.png')}
          style={styles.reactLogo}
          resizeMode="center"

        />
      }>
      <ThemedView style={styles.titleContainer}>

        <TextInput
          style={styles.textInput}
          placeholder='Add friend'
          value={searchQuery}
          editable={true}
          selectTextOnFocus={true}
          onChangeText={setSearchQuery}
        />
        <Pressable onPress={() => handleSearch(searchQuery)}>
          <IconSymbol
            name="magnifyingglass.circle.fill"
            size={30}
            color="rgba(0, 0, 0, 0.65)"
            style={{ marginRight: 8 }}
          />
        </Pressable>

      </ThemedView>
      {filteredFriends && (
        <ThemedView style={styles.dropdown}>
          <ScrollView>
            {Array.isArray(filteredFriends) ? (
              filteredFriends.map((friend) => (
                <ThemedView key={friend._id} style={styles.dropdownItem}>
                  <ThemedText>{friend.username}</ThemedText>
                  {!userProfile?.connectedUsers.includes(friend._id) && (
                    <Pressable
                      style={styles.addButton}
                      onPress={() => handleAddFriend(friend)}
                    >
                      <ThemedText style={styles.addButtonText}>Add</ThemedText>
                    </Pressable>
                  )}
                  <ThemedView>
                    <Pressable
                      style={[styles.buttonShadowBox, styles.Button]}
                      onPress={() => { setFilteredFriends(undefined) }}
                    >
                      <ThemedText style={[styles.buttonText]}>Clear Results</ThemedText>
                    </Pressable>
                  </ThemedView>
                </ThemedView>
              ))
            ) : (
              <ThemedView key={filteredFriends._id} style={styles.dropdownItem}>
                <ThemedText style={{ marginLeft: 8 }}>{filteredFriends.username}</ThemedText>
                {!userProfile?.connectedUsers.includes(filteredFriends._id) && (
                  <Pressable
                    style={styles.addButton}
                    onPress={() => handleAddFriend(filteredFriends)}
                  >
                    <ThemedText style={styles.addButtonText}>Add</ThemedText>
                  </Pressable>
                )}

              </ThemedView>
            )}
            <ThemedView style={{ backgroundColor: '#A1CEDC' }}>
              <Pressable
                style={[styles.buttonShadowBox, styles.Button]}
                onPress={() => { setFilteredFriends(undefined) }}
              >
                <ThemedText style={[styles.buttonText]}>Clear Results</ThemedText>
              </Pressable>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      )}


      <ThemedText>Your all shared expenses.</ThemedText>
      <ThemedView style={styles.stepContainer}>
        <ThemedView style={styles.container}>
          {data.length > 0 ? (
            <ScrollView style={styles.formContainer}>
              {data.map((item) => (
                <DebtSummaryForm key={item.ConnectedId} data={item} />
              ))}
            </ScrollView>
          ) : (
            <ThemedView style={styles.row}>
              <ThemedText>No history found</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

      </ThemedView>
    </ParallaxScrollView>
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
    width: "95%",
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.65)",
  },
  buttonShadowBox: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 40,
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
    fontSize: 16,
    lineHeight: 35,
    textAlign: "center",
  },
  Button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#A1CEDC",
    borderRadius: 8,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 220,
    width: 290,
    top: 50,
    bottom: 0,
    left: '20%',
    position: 'absolute',
  },
  dropdown: {
    backgroundColor: "#A1CEDC",
    borderRadius: 8,
    padding: 8,
    marginTop: 0,
    maxHeight: 200,
    overflow: "hidden",
    // zIndex: 1000, // Ensure the dropdown is above other elements
    // position: "absolute", // Ensure it floats above other content
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
