import {
  View,
  Pressable,
  StyleSheet,
  Button,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { router, useRouter } from "expo-router";
import { useEffect } from "react";

const LoginButton = () => {
  const { authorize } = useAuth0();

  const onPress = async () => {
    try {
      const result = await authorize();
      if (result) {
        console.log(result);
        router.push("/(authenticate)/userInfo");
      } else {
        console.log("Login canceled or failed:", result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Pressable
      style={[styles.loginButton, styles.buttonShadowBox]}
      onPress={onPress}
    >
      <ThemedText style={[styles.login]}>Login Using Auth0</ThemedText>
    </Pressable>
  );
};

export default function Authenticate() {
  const { user } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/(authenticate)/userInfo");
    }
  }, [user]);

  return (
    <ThemedView style={styles.authentication}>
      <LinearGradient
        style={styles.image1}
        locations={[0.28, 0.54, 0.82]}
        colors={["#bff0fc", "#9dc5cf", "#728e96"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <ThemedText style={[styles.moneyMate]}>MONEY MATE</ThemedText>
      <Image
        source={require("@/assets/images/Moneymate.png")}
        style={styles.image}
      />
      {/* <ThemedText style={[styles.welcomeBack]}>Welcome Back</ThemedText> */}
      {LoginButton()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  image: {
    top: "25%",
    width: 300, // Set the width of the image
    height: 300, // Set the height of the image
    resizeMode: "contain", // Ensure the image scales properly
    alignSelf: "center", // Center the image horizontally
    marginTop: 50, // Add some spacing from the top
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

  login: {
    color: "rgba(0, 0, 0, 0.65)",
    fontSize: 20,
    lineHeight: 40,
  },
  loginButton: {
    top: "70%",
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

  welcomeBack: {
    top: "20%",
    alignSelf: "center",
    letterSpacing: -0.5,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "#f9f7f7",
    textAlign: "center",
    alignItems: "center",
    fontSize: 24,
  },
  authentication: {
    backgroundColor: "#f7fffd",
    flex: 1,
    height: 956,
    overflow: "hidden",
    width: "100%",
    flexDirection: "column",
  },
});
