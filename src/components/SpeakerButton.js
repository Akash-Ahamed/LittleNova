import React from "react";
import { Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SpeakerButton({ muted, onToggleMute, onPlayAudio }) {
  return (
    <TouchableOpacity
      onPress={onToggleMute}
      onLongPress={onPlayAudio}
      style={styles.speakerIcon}
    >
      <Image
        source={
          muted
            ? require("../../assets/Numbers/CountObjects/muteSpeaker.png")
            : require("../../assets/Numbers/CountObjects/UnmuteSpeaker.png")
        }
        style={styles.speakerIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  speakerIcon: {
    position: "absolute",
    left: 30,
    width: width * 0.05,
    aspectRatio: 1,
    resizeMode: "contain",
    zIndex: 40,
  },
});