import React from "react";
import { Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const { width } = Dimensions.get("window");

export default function CelebrationConfetti({ visible }) {
  if (!visible) return null;

  return (
    <ConfettiCannon
      count={200}
      origin={{ x: width / 2, y: 0 }}
      fadeOut
      size={84}
      explosionSpeed={250}
      fallSpeed={1100}
    />
  );
}