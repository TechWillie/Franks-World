import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Schoolbell_400Regular } from '@expo-google-fonts/schoolbell';
import { Text } from 'react-native';


import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const [fontsLoaded] = useFonts({
  Schoolbell: Schoolbell_400Regular,
});

console.log('fontsLoaded:', fontsLoaded);


export default function RootLayout() {
  const colorScheme = useColorScheme();

    const [fontsLoaded] = useFonts({
    Schoolbell: Schoolbell_400Regular,
  });

  if (!fontsLoaded) {
    return null; // or a splash screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}