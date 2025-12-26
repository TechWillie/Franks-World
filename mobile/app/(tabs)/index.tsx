import { Image } from 'expo-image';
import { View, Pressable, Text, Platform, StyleSheet } from 'react-native';


import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, router } from 'expo-router';

import AppText from '@/components/AppText';

export default function HomeScreen() {
  return (
    <View style={{ 
      flex: 0, padding: 100, height:150,
      backgroundColor: "#0b59b8ff"
    }}>
      <Pressable onPress={() => router.push('/explore')}>
      <AppText style={{ 
        fontSize: 45, 
      fontWeight: 'bold', fontFamily: 'Schoolbell'
      }}>Hello how are you</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
