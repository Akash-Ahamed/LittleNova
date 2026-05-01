import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";

export default function MatchQuantityToDigit() {
  return (
    <SafeAreaView>
        <View>
      <Text>MatchQuantityToDigit</Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
     safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
})