import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CountObjects from "../screens/numbers/CountObjects";
import MatchQuantityToDigit from "../screens/numbers/MatchQuantityToDigit";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  console.log(
    "[AppNavigator] mounted — NavigationContainer lives in App.js ✅",
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CountObjects" component={CountObjects} />
      <Stack.Screen
        name="MatchQuantityToDigit"
        component={MatchQuantityToDigit}
      />
    </Stack.Navigator>
  );
}
