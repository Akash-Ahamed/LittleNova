import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NumberOptionsChip from "../../components/numbers/NumberOptionsChip";
import NumberQuestionImage from "../../components/numbers/NumberQuestionImage";
import SpeakerButton from "../../components/SpeakerButton";
import CelebrationConfetti from "../../components/CelebrationConfetti";
import { useCountObjects } from "../../hooks/useCountObjects";
import useProgressStore from "../../store/useProgressStore";

const { width } = Dimensions.get("window");
const DROP_ZONE_WIDTH = width * 0.16;
const DROP_ZONE_HEIGHT = DROP_ZONE_WIDTH * 0.7;

export default function CountObjects() {
  const {
    question,
    answer,
    showCelebrate,
    showHint,
    muted,
    agentReason,
    currentIndex,
    totalQuestions,
    setDropZone,
    handleDrop,
    setMuted,
    playQuestion,
  } = useCountObjects();

  const childState = useProgressStore((state) => state.childState);

  return (
    <ImageBackground
      source={require("../../../assets/Numbers/CountObjects/Background1.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* ── progress dots ── */}
        <View style={styles.progressRow}>
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.gameContent}>
          <View style={styles.topArea}>
            <NumberQuestionImage question={question} />

            {/* ── drop zone ── */}
            <View
              style={[
                styles.dropZone,
                answer?.correct && styles.dropZoneCorrect,
              ]}
              onLayout={(e) => {
                e.target.measureInWindow((x, y, w, h) => {
                  setDropZone({ x, y, width: w, height: h });
                });
              }}
            >
              <Text
                style={[
                  styles.answerText,
                  answer?.correct && styles.correctTextColor,
                ]}
              >
                {answer?.correct ? answer.value : ""}
              </Text>
            </View>
          </View>

          {/* ── hint text — shown when agent says shouldShowHint ── */}
          {showHint && (
            <View style={styles.hintBanner}>
              <Text style={styles.hintText}>
                Count carefully! The answer is highlighted below.
              </Text>
            </View>
          )}

          {/* ── number chips ── */}
          <View style={styles.optionsRow}>
            {question.options.map((number) => (
              <NumberOptionsChip
                key={number}
                number={number}
                onDrop={handleDrop}
                isHint={showHint && number === question.correct}
              />
            ))}
          </View>
        </View>

        <SpeakerButton
          muted={muted}
          onToggleMute={() => setMuted((prev) => !prev)}
          onPlayAudio={playQuestion}
        />

        <CelebrationConfetti visible={showCelebrate} />

        {/* ── DEBUG OVERLAY */}
        {__DEV__ && (
          <View style={styles.debugOverlay}>
            <Text style={styles.debugText}>Seq: {question.sequence}</Text>
            <Text style={styles.debugText}>Q: {question.id}</Text>
            <Text style={styles.debugText}>
              diff: {question.difficultyLevel}
            </Text>
            <Text style={styles.debugText}>
              idx: {currentIndex}/{totalQuestions - 1}
            </Text>

            <Text style={styles.debugText2}>streak: {childState.correctStreak}</Text>
            <Text style={styles.debugText2}>wrong: {childState.wrongStreak}</Text>
            <Text style={styles.debugText2}>accuracy: {Math.round(childState.accuracy * 100)}%</Text>

            <Text style={styles.debugText2}>
              attempts: {childState.totalAttempts}
            </Text>

            <Text style={styles.debugText2}>
              avg time: {(childState.avgResponseTime / 1000).toFixed(1)}s
            </Text>

            {agentReason ? (
              <Text style={styles.debugReason}>{agentReason}</Text>
            ) : null}
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  safeArea: { flex: 1, paddingHorizontal: 24, paddingVertical: 40 },

  progressRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFFFFF50" },
  dotActive: { backgroundColor: "#FFD93D", transform: [{ scale: 1.3 }] },

  gameContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topArea: {
    flex: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  dropZone: {
    position: "absolute",
    right: "18%",
    top: "32%",
    width: DROP_ZONE_WIDTH,
    height: DROP_ZONE_HEIGHT,
     //backgroundColor: "black",
     backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  dropZoneCorrect: { backgroundColor: "#E9FFF1", borderRadius: 8 },
  correctTextColor: { color: "#35B86B" },
  answerText: {
    fontSize: 60,
    position: "absolute",
    paddingBottom: 10,
    paddingRight: 15,
    fontWeight: "900",
    color: "#12384A",
  },

  hintBanner: {
    backgroundColor: "#00000040",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    zIndex: 25,
  },
  hintText: { fontSize: 13, color: "#FFFFFF", textAlign: "center" },

  optionsRow: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    bottom: 30,
    zIndex: 30,
  },

  // ── debug overlay — only visible in __DEV__ mode ──
  debugOverlay: {
    position: "absolute",
    bottom: 100,
    left: 16,
    backgroundColor: "#00000088",
    padding: 8,
    borderRadius: 8,
    zIndex: 99,
  },
  debugText: {
    color: "#FFD93D",
    fontSize: 11,
    fontFamily: "monospace",
  },
    debugText2: {
    color: "#9d0781",
    fontSize: 11,
    fontFamily: "monospace",
  },

  debugReason: {
    color: "#A8E6CF",
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 4,
    maxWidth: 200,
  },
});
