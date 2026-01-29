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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Auth0Provider
        domain={"dev-2sc4okx2cibmjc8r.us.auth0.com"}
        clientId={"hGBeSUXoT4x1C4yyro3PUJXIHJVcO6FU"}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(authenticate)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(transaction)" />
          <Stack.Screen name="(debt)" />
          <Stack.Screen name="(addBill)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Auth0Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
