import React from "react";
import { Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

export default function NumberOptionsChip({ number, onDrop, isHint }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      x.value = event.translationX;
      y.value = event.translationY;
    })
    .onEnd((event) => {
      runOnJS(onDrop)(number, event.absoluteX, event.absoluteY);
      x.value = 0;
      y.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.numberChip, animatedStyle, isHint && styles.hintChip,]}>
        <Text style={styles.numberText}>{number}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  numberChip: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFD86B",
    borderWidth: 2,
    borderColor: "#12384A",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#12384A",
  },
//   hintChip: {
//   borderColor: '#00B894',
//   borderWidth: 3,
// }
});