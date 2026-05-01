import { useState, useEffect, useRef, useCallback } from "react";
import { useAudioPlayer } from "expo-audio";
import { COUNT_OBJECT_QUESTIONS } from "../data/numbers/countObjectQuestions";
import { act } from "../agent/engine";
import useProgressStore from "../store/useProgressStore";
import { AGENT_CONFIG as C } from "../agent/config";

const ACTIVITY_TYPE = "count_objects";
const LOG = (step, data) =>
  console.log(
    `[Agent:${ACTIVITY_TYPE}] ${step}`,
    JSON.stringify(data, null, 2),
  );

export function useCountObjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [dropZone, setDropZone] = useState(null);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [agentReason, setAgentReason] = useState("");

  const questionStartTime = useRef(Date.now());
  const { recordAnswer, addStars } = useProgressStore();
  const question = COUNT_OBJECT_QUESTIONS[currentIndex];

  // ── debug: log every question load ────────────────────────────────────────
  useEffect(() => {
    LOG("question loaded", {
      index: currentIndex,
      Sequence: question.sequence,
      id: question.id,
      difficultyLevel: question.difficultyLevel,
      correct: question.correct,
      options: question.options,
      distractorGap: question.distractorGap,
    });
  }, [currentIndex]);

  // ── audio ──────────────────────────────────────────────────────────────────
  const questionPlayer = useAudioPlayer(question.audio);
  const successPlayer = useAudioPlayer(
    require("../../assets/audio/Numbers/CountObject/confetti.mp3"),
  );

  const playQuestion = useCallback(() => {
    if (muted) return;
    questionPlayer.seekTo(0);
    questionPlayer.play();
  }, [muted, questionPlayer]);

  useEffect(() => {
    questionStartTime.current = Date.now();
    setShowHint(false);
    const timer = setTimeout(playQuestion, C.AUDIO_START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // ── drop handler ───────────────────────────────────────────────────────────
  const handleDrop = useCallback(
    (number, dropX, dropY) => {
      if (!dropZone || answer?.correct) return;

      const DROP_TOLERANCE = 40;

      const isInside =
        dropX >= dropZone.x - DROP_TOLERANCE &&
        dropX <= dropZone.x + dropZone.width + DROP_TOLERANCE &&
        dropY >= dropZone.y - DROP_TOLERANCE &&
        dropY <= dropZone.y + dropZone.height + DROP_TOLERANCE;

      LOG("drop attempt", {
        droppedNumber: number,
        dropX,
        dropY,
        dropZone,
        isInside,
        correctAnswer: question.correct,
      });

      if (!isInside) {
        console.log("[Agent] drop missed the drop zone — ignored");
        return;
      }

      const responseTime = Date.now() - questionStartTime.current;
      const isCorrect = number === question.correct;

      LOG("answer evaluated", {
        droppedNumber: number,
        correctAnswer: question.correct,
        isCorrect,
        responseTimeMs: responseTime,
      });

      // ── 1. record answer → updates childState + persists ──────────────────
      recordAnswer(question.id, isCorrect, responseTime, ACTIVITY_TYPE);

      // ── 2. read fresh state immediately after store update ────────────────
      const freshState = useProgressStore.getState().childState;

      LOG("childState after answer", {
        totalAttempts: freshState.totalAttempts,
        correctStreak: freshState.correctStreak,
        wrongStreak: freshState.wrongStreak,
        accuracy: parseFloat(freshState.accuracy.toFixed(3)),
        avgResponseTime: Math.round(freshState.avgResponseTime),
        activityDifficulty: freshState.difficultyByActivity[ACTIVITY_TYPE],
      });

      if (!isCorrect) {
        if (freshState.wrongStreak >= C.WRONG_STREAK_FOR_HINT) {
          console.log("[Agent] wrong streak reached threshold → showing hint");
          setShowHint(true);
        }
        return;
      }

      // ── 3. correct — celebrate ────────────────────────────────────────────
      setAnswer({ value: number, correct: true });
      successPlayer.seekTo(0);
      successPlayer.play();
      setShowCelebrate(true);
      setTimeout(() => setShowCelebrate(false), C.CONFETTI_DURATION_MS);

      // ── 4. call agent ─────────────────────────────────────────────────────
      const decision = act(
        freshState,
        COUNT_OBJECT_QUESTIONS,
        currentIndex,
        ACTIVITY_TYPE,
      );
      setAgentReason(decision.reason);

      LOG("agent decision", {
        nextQuestionIndex: decision.nextQuestionIndex,
        nextQuestionId: COUNT_OBJECT_QUESTIONS[decision.nextQuestionIndex]?.id,
        nextDifficulty:
          COUNT_OBJECT_QUESTIONS[decision.nextQuestionIndex]?.difficultyLevel,
        shouldShowHint: decision.shouldShowHint,
        shouldSlowDown: decision.shouldSlowDown,
        reason: decision.reason,
      });

      // ── 5. award stars ────────────────────────────────────────────────────
      const stars =
        freshState.accuracy > 0.9 ? 3 : freshState.accuracy > 0.7 ? 2 : 1;
      addStars("numbers", stars);

      LOG("stars awarded", {
        stars,
        accuracy: parseFloat(freshState.accuracy.toFixed(3)),
      });

      // ── 6. advance to next question ───────────────────────────────────────
      const delay =
        C.NEXT_QUESTION_DELAY_MS +
        (decision.shouldSlowDown ? C.SLOW_DOWN_EXTRA_MS : 0);

      console.log(`[Agent] advancing to next question in ${delay}ms`);

      setTimeout(() => {
        setAnswer(null);
        setCurrentIndex(decision.nextQuestionIndex);
        if (decision.shouldShowHint) setShowHint(true);
      }, delay);
    },
    [
      dropZone,
      answer,
      question,
      currentIndex,
      recordAnswer,
      addStars,
      successPlayer,
    ],
  );

  return {
    question,
    answer,
    showCelebrate,
    showHint,
    muted,
    agentReason,
    currentIndex,
    totalQuestions: COUNT_OBJECT_QUESTIONS.length,
    setDropZone,
    handleDrop,
    setMuted,
    playQuestion,
  };
}
