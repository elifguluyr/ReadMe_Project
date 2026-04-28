import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const hazirlikYap = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    hazirlikYap();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}