
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import useProgressStore from './src/store/useProgressStore';

export default function App() {
  const loadProgress = useProgressStore((state) => state.loadProgress);

  useEffect(() => {
    loadProgress(); // hydrate Zustand from AsyncStorage on launch
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}