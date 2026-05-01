// Same agent engine, different activity. Shows how reusable the pattern is.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { MATCH_QUANTITY_QUESTIONS } from '../data/numbers/matchQuantityQuestions';
import { act } from '../agent/engine';
import useProgressStore from '../store/useProgressStore';
import { AGENT_CONFIG as C } from '../agent/config';

const ACTIVITY_TYPE = 'match_quantity'; // ← only line that changes per activity

export function useMatchQuantity() {
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [muted, setMuted]                 = useState(false);
  const [showHint, setShowHint]           = useState(false);
  const [agentReason, setAgentReason]     = useState('');

  const questionStartTime = useRef(Date.now());
  const { recordAnswer, addStars } = useProgressStore();
  const question = MATCH_QUANTITY_QUESTIONS[currentIndex];

  const questionPlayer = useAudioPlayer(question?.audio);
  const successPlayer  = useAudioPlayer(
    require('../../assets/audio/Numbers/CountObject/confetti.mp3')
  );

  useEffect(() => {
    questionStartTime.current = Date.now();
    setShowHint(false);
    setSelectedAnswer(null);
    if (!muted && question?.audio) {
      const timer = setTimeout(() => {
        questionPlayer.seekTo(0);
        questionPlayer.play();
      }, C.AUDIO_START_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleAnswer = useCallback((chosen) => {
    if (selectedAnswer !== null) return; // already answered

    const responseTime = Date.now() - questionStartTime.current;
    const isCorrect    = chosen === question.correct;

    recordAnswer(question.id, isCorrect, responseTime, ACTIVITY_TYPE);

    if (!isCorrect) {
      setSelectedAnswer({ value: chosen, correct: false });
      const fresh = useProgressStore.getState().childState;
      if (fresh.wrongStreak >= C.WRONG_STREAK_FOR_HINT) setShowHint(true);
      return;
    }

    setSelectedAnswer({ value: chosen, correct: true });
    successPlayer.seekTo(0);
    successPlayer.play();
    setShowCelebrate(true);
    setTimeout(() => setShowCelebrate(false), C.CONFETTI_DURATION_MS);

    const freshState = useProgressStore.getState().childState;
    const decision   = act(freshState, MATCH_QUANTITY_QUESTIONS, currentIndex, ACTIVITY_TYPE);
    setAgentReason(decision.reason);

    const stars =
      freshState.accuracy > 0.90 ? 3 :
      freshState.accuracy > 0.70 ? 2 : 1;
    addStars('numbers', stars);

    const delay = C.NEXT_QUESTION_DELAY_MS +
      (decision.shouldSlowDown ? C.SLOW_DOWN_EXTRA_MS : 0);

    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentIndex(decision.nextQuestionIndex);
      if (decision.shouldShowHint) setShowHint(true);
    }, delay);

  }, [selectedAnswer, question, currentIndex, recordAnswer, addStars, successPlayer]);

  return {
    question,
    selectedAnswer,
    showCelebrate,
    showHint,
    muted,
    agentReason,
    currentIndex,
    totalQuestions: MATCH_QUANTITY_QUESTIONS.length,
    handleAnswer,
    setMuted,
  };
}