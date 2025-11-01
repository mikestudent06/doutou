import "@/app/globals.css";
import Loader from "@/components/Loader";
import { useDatabase } from "@/hooks/useDatabase";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // Initialize database
  const { isReady: dbReady, error: dbError } = useDatabase();

  useEffect(() => {
    if (error) throw error;
    if (dbError) {
      console.error("Database initialization error:", dbError);
      // You might want to show an error screen here
    }
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [error, fontsLoaded, dbReady, dbError]);

  if (!fontsLoaded || !dbReady) return <Loader />;

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
