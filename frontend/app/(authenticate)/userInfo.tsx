import { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import { GetUser, CreateUser } from "@/api/apiService";
import { useAuth0 } from "react-native-auth0";
import { UserInfo } from "@/api/apiInterface";

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

export default function Authenticate() {
  const { user } = useAuth0();
  const [Firstname, setFirstName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [userName, setUsername] = useState("");

  const [userExists, setUserExists] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");

  useEffect(() => {
    if (user) {
      const email = user.email ?? "";
      checkUserExists(email)
        .then((userProfile) => {
          if (userProfile) {
            setFirstName(userProfile.firstname);
            setLastName(userProfile.lastname);
            setUsername(userProfile.username);
            setUserExists(true);
            setButtonText("Continue");
          } else {
            setUserExists(false);
            setButtonText("Submit");
          }
        })
        .catch((error) => {
          console.error("Error checking user existence:", error);
        });
    }
  }, [user]);

  const onPress = async () => {
    try {
      if (buttonText === "Submit") {
        if (
          !userName.trim().toLowerCase() ||
          !Firstname.trim() ||
          !Lastname.trim()
        ) {
          alert("Please enter all the information.");
          return;
        }
        console.log(user);
        if (!user) {
          alert("User is not authenticated.");
          return;
        }
        const newUser: any = {
          username: userName,
          email: user?.email ?? "",
          firstname: Firstname,
          lastname: Lastname,
        };
        await CreateUser(newUser);
        console.log("User created successfully!");
      }
      router.replace("/(tabs)");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.nameForm}>
      <LinearGradient
        style={styles.image1}
        locations={[0.28, 0.54, 0.82]}
        colors={["#bff0fc", "#9dc5cf", "#728e96"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ThemedText style={[styles.moneyMate]}>MONEY MATE</ThemedText>

      <ThemedText style={[styles.formtitle]}>
        Please check or update your information
      </ThemedText>
      <ThemedView style={styles.form}>
        <ThemedText style={styles.fieldTitle}> Username</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your username"
          value={userName}
          editable={buttonText === "Submit"}
          selectTextOnFocus={buttonText === "Submit"}
          onChangeText={(text) => setUsername(text)}
        />
        <ThemedText style={styles.fieldTitle}> First Name</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your first name"
          value={Firstname}
          editable={buttonText === "Submit"}
          selectTextOnFocus={buttonText === "Submit"}
          onChangeText={(text) => setFirstName(text)}
        />
        <ThemedText style={styles.fieldTitle}> Last Name</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your Last name"
          value={Lastname}
          editable={buttonText === "Submit"}
          selectTextOnFocus={buttonText === "Submit"}
          onChangeText={(text) => setLastName(text)}
        />
      </ThemedView>
      <Pressable
        style={[styles.HomeButton, styles.buttonShadowBox]}
        onPress={onPress}
      >
        <ThemedText style={[styles.submit]}>{buttonText}</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldTitle: {
    left: "10%",
  },
  form: {
    top: "30%",
    alignSelf: "center",
    width: "80%",
    height: 350,
    backgroundColor: "#F6FDFF",
    flexDirection: "column",
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: "center",
    width: "80%",
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.65)",
  },
  buttonShadowBox: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    left: 89,
    height: 50,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    position: "absolute",
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

  submit: {
    color: "rgba(0, 0, 0, 0.65)",
    fontSize: 20,
    lineHeight: 40,
  },
  HomeButton: {
    top: "80%",
    height: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  moneyMate: {
    top: "10%",
    left: 233,
    color: "#728e96",
    width: 191,
    height: 25,
    fontSize: 24,
  },

  formtitle: {
    top: "27%",
    alignSelf: "center",
    letterSpacing: -0.5,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "rgba(0, 0, 0, 0.65)",
    textAlign: "center",
    alignItems: "center",
    fontSize: 20,
  },
  nameForm: {
    backgroundColor: "#f7fffd",
    flex: 1,
    height: 956,
    overflow: "hidden",
    width: "100%",
    flexDirection: "column",
  },
});
