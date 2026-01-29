import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Auth0Provider } from "react-native-auth0";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Header } from "react-native/Libraries/NewAppScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function addBillLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
            <Stack >
                <Stack.Screen name="bill" options={{
                    headerShown: true,
                    title: "Check/Modify Bill",
                    headerBackButtonDisplayMode: "minimal",
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
                <Stack.Screen name="complete" options={{
                    headerShown: true,
                    title: "Bill added",
                    headerBackButtonMenuEnabled: false,
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
                <Stack.Screen name="upload" options={{
                    headerShown: true,
                    title: "Upload",
                    headerBackButtonMenuEnabled: false,
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
                <Stack.Screen name="camera" options={{
                    headerShown: true,
                    title: "Take a picture",
                    headerBackButtonMenuEnabled: false,
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
