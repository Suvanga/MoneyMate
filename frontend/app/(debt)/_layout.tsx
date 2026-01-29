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

export default function DebtsLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
            <Stack >
                <Stack.Screen name="debts" options={{
                    headerShown: true,
                    title: "All Shared Expenses",
                    headerBackButtonDisplayMode: "minimal",
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
                <Stack.Screen name="debtDetail" options={{
                    headerShown: true,
                    title: "Details",
                    headerBackButtonDisplayMode: "minimal",
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
                <Stack.Screen name="pay" options={{
                    headerShown: true,
                    title: "Payment",
                    headerBackButtonDisplayMode: "minimal",
                    headerStyle: {
                        backgroundColor: "#728e96",
                    },
                    headerTitleStyle: {
                        color: "#000",
                    },
                }} />
                <Stack.Screen name="complete" options={{
                    headerShown: false,
                }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
