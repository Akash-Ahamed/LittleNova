import React from "react";
import { Image, StyleSheet } from "react-native";

export default function NumberQuestionImage({ question }) {
  return (
    <Image
      source={question.image}
      style={[
        styles.questionImage,
        {
          transform: [
            { scale: question.imageStyle?.scale ?? 1 },
            { translateX: question.imageStyle?.translateX ?? 0 },
            { translateY: question.imageStyle?.translateY ?? 0 },
          ],
        },
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  questionImage: {
    width: "150%",
    height: "150%",
    zIndex: 20,
  },
});