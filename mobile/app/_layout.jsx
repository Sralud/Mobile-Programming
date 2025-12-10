import { Stack } from "expo-router";
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PlayerProvider } from './contexts/PlayerContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Audiowide_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PlayerProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlayerProvider>
  );
}