// Pure functions — no React, no side effects, fully unit-testable with Vitest.
// perceive() → think() → act() — called by every activity hook.

import { logAgentStep } from './debugLogger';
import { AGENT_CONFIG as C } from './config';
import type { ChildState, Question, AgentDecision, LearningStatus, ActivityType } from './types';

// ── PERCEIVE ──────────────────────────────────────────────────────────────────
// Reads childState and classifies what state the child is in right now.
export function perceive(state: ChildState, activityType: ActivityType): LearningStatus {
  const currentDifficulty = state.difficultyByActivity[activityType] ?? 1;

  const isTooManyWrong = state.wrongStreak  >= C.WRONG_STREAK_FOR_HINT;
  const isLowAccuracy  = state.accuracy     <  C.LOW_ACCURACY_THRESHOLD;
  const isHighStreak   = state.correctStreak >= C.CORRECT_STREAK_TO_LEVEL_UP;
  const isHighAccuracy = state.accuracy     >  C.HIGH_ACCURACY_THRESHOLD;
  const isFastResponse =
    state.avgResponseTime > 0 &&
    state.avgResponseTime < C.FAST_RESPONSE_MS;
  const isAtMaxDifficulty = currentDifficulty >= C.MAX_DIFFICULTY;

  if (isTooManyWrong || isLowAccuracy) {
    return 'struggling';
  }

  // Only mark excelling if not already at max difficulty
  if (!isAtMaxDifficulty && (isHighStreak && (isHighAccuracy || isFastResponse))) {
    return 'excelling';
  }

  return 'on_track';
}

// ── THINK ─────────────────────────────────────────────────────────────────────
// Given a status, picks the right question and flags.
export function think(
  status:       LearningStatus,
  questions:    Question[],
  currentIndex: number,
  activityType: ActivityType,
  state?: ChildState,
): AgentDecision {
  const currentDifficulty =
    state?.difficultyByActivity[activityType] ?? questions[currentIndex]?.difficultyLevel ?? C.MIN_DIFFICULTY;

  if (status === 'struggling') {
    const targetDifficulty = Math.max(currentDifficulty - 1, C.MIN_DIFFICULTY);

    const easierIndex = findNextQuestionIndexByDifficulty(
      questions,
      currentIndex,
      targetDifficulty,
    );

    return {
      nextQuestionIndex: easierIndex,
      shouldShowHint:    true,
      shouldSlowDown:    true,
      reason: `Struggling → difficulty ${targetDifficulty}, question index ${easierIndex}`,
    };
  }

  if (status === 'excelling') {
    const targetDifficulty = Math.min(currentDifficulty + 1, C.MAX_DIFFICULTY);

    const harderIndex = findNextQuestionIndexByDifficulty(
      questions,
      currentIndex,
      targetDifficulty,
    );

    return {
      nextQuestionIndex: harderIndex,
      shouldShowHint:    false,
      shouldSlowDown:    false,
      reason: `Excelling → difficulty ${targetDifficulty}, question index ${harderIndex}`,
    };
  }

  const nextIndex = findNextQuestionIndexByDifficulty(
    questions,
    currentIndex,
    currentDifficulty,
  );

  return {
    nextQuestionIndex: nextIndex,
    shouldShowHint:    false,
    shouldSlowDown:    false,
    reason: `On track → difficulty ${currentDifficulty}, question index ${nextIndex}`,
  };
}

// ── ACT ───────────────────────────────────────────────────────────────────────
// Single entry point — hooks call this after every correct answer.
// export function act(
//   state:        ChildState,
//   questions:    Question[],
//   currentIndex: number,
//   activityType: ActivityType,
// ): AgentDecision {
//   const status = perceive(state, activityType);
//   return think(status, questions, currentIndex, activityType);
// }

export function act(
  state:        ChildState,
  questions:    Question[],
  currentIndex: number,
  activityType: ActivityType,
): AgentDecision {
  logAgentStep('ACT INPUT', {
    activityType,
    currentIndex,
    currentQuestion: questions[currentIndex]?.id,
    childState: state,
  });

  const status = perceive(state, activityType);

  logAgentStep('PERCEIVE OUTPUT', {
    status,
    currentDifficulty: state.difficultyByActivity[activityType] ?? 1,
    correctStreak: state.correctStreak,
    wrongStreak: state.wrongStreak,
    accuracy: state.accuracy,
    avgResponseTime: state.avgResponseTime,
  });

  const decision = think(status, questions, currentIndex, activityType, state);

  logAgentStep('THINK / ACT OUTPUT', {
    decision,
    nextQuestion: questions[decision.nextQuestionIndex]?.id,
  });

  return decision;
}

// ── updateChildState ──────────────────────────────────────────────────────────
// Called by the store after every answer (correct or wrong).
// Returns a NEW state object — never mutates.
// export function updateChildState(
//   prev:          ChildState,
//   isCorrect:     boolean,
//   responseTime:  number,
//   activityType:  ActivityType,
// ): ChildState {
//   const newAttempts = prev.totalAttempts + 1;

//   const newAccuracy = isCorrect
//     ? (prev.accuracy * (newAttempts - 1) + 1) / newAttempts
//     : (prev.accuracy * (newAttempts - 1))     / newAttempts;

//   const newAvgTime = prev.avgResponseTime > 0
//     ? (prev.avgResponseTime * (newAttempts - 1) + responseTime) / newAttempts
//     : responseTime;

//   // Update per-activity difficulty
//   const prevDiff = prev.difficultyByActivity[activityType] ?? 1;
//   let newDiff = prevDiff;
//   if (isCorrect && prev.correctStreak + 1 >= C.CORRECT_STREAK_TO_LEVEL_UP) {
//     newDiff = Math.min(prevDiff + 1, C.MAX_DIFFICULTY);
//   }
//   if (!isCorrect && prev.wrongStreak + 1 >= C.WRONG_STREAK_FOR_HINT) {
//     newDiff = Math.max(prevDiff - 1, C.MIN_DIFFICULTY);
//   }

//   return {
//     ...prev,
//     totalAttempts:   newAttempts,
//     correctStreak:   isCorrect ? prev.correctStreak + 1 : 0,
//     wrongStreak:     isCorrect ? 0 : prev.wrongStreak + 1,
//     accuracy:        newAccuracy,
//     avgResponseTime: newAvgTime,
//     difficultyByActivity: {
//       ...prev.difficultyByActivity,
//       [activityType]: newDiff,
//     },
//     lastSessionDate: new Date().toISOString(),
//   };
// }

export function updateChildState(
  prev:          ChildState,
  isCorrect:     boolean,
  responseTime:  number,
  activityType:  ActivityType,
): ChildState {
  logAgentStep('UPDATE STATE INPUT', {
    previousState: prev,
    isCorrect,
    responseTime,
    activityType,
  });

  const newAttempts = prev.totalAttempts + 1;

  const newAccuracy = isCorrect
    ? (prev.accuracy * (newAttempts - 1) + 1) / newAttempts
    : (prev.accuracy * (newAttempts - 1))     / newAttempts;

  const newAvgTime = prev.avgResponseTime > 0
    ? (prev.avgResponseTime * (newAttempts - 1) + responseTime) / newAttempts
    : responseTime;

  const prevDiff = prev.difficultyByActivity[activityType] ?? 1;
  let newDiff = prevDiff;

  if (isCorrect && prev.correctStreak + 1 >= C.CORRECT_STREAK_TO_LEVEL_UP) {
    newDiff = Math.min(prevDiff + 1, C.MAX_DIFFICULTY);
  }

  if (!isCorrect && prev.wrongStreak + 1 >= C.WRONG_STREAK_FOR_HINT) {
    newDiff = Math.max(prevDiff - 1, C.MIN_DIFFICULTY);
  }

  const nextState = {
    ...prev,
    totalAttempts:   newAttempts,
    correctStreak:   isCorrect ? prev.correctStreak + 1 : 0,
    wrongStreak:     isCorrect ? 0 : prev.wrongStreak + 1,
    accuracy:        newAccuracy,
    avgResponseTime: newAvgTime,
    difficultyByActivity: {
      ...prev.difficultyByActivity,
      [activityType]: newDiff,
    },
    lastSessionDate: new Date().toISOString(),
  };

  logAgentStep('UPDATE STATE OUTPUT', {
    nextState,
    difficultyChanged: prevDiff !== newDiff,
    previousDifficulty: prevDiff,
    newDifficulty: newDiff,
  });

  return nextState;
}

// ── Helper ────────────────────────────────────────────────────────────────────
// function findQuestionByDifficulty(
//   questions:    Question[],
//   currentIndex: number,
//   direction:    'easier' | 'harder',
// ): number {
//   const currentDiff = questions[currentIndex]?.difficultyLevel ?? 1;
//   const targetDiff  = direction === 'harder' ? currentDiff + 1 : currentDiff - 1;

//   const candidates = questions
//     .map((q, i) => ({ i, diff: q.difficultyLevel }))
//     .filter(({ i, diff }) =>
//       i !== currentIndex &&
//       (direction === 'harder' ? diff >= targetDiff : diff <= targetDiff)
//     );

//   if (candidates.length === 0) {
//     // Nothing found — nudge one step in the right direction
//     return direction === 'easier'
//       ? Math.max(currentIndex - 1, 0)
//       : Math.min(currentIndex + 1, questions.length - 1);
//   }

//   // Pick the candidate closest to currentIndex — avoid big jumps
//   return candidates.reduce((best, c) =>
//     Math.abs(c.i - currentIndex) < Math.abs(best.i - currentIndex) ? c : best
//   ).i;
// }

function findNextQuestionIndexByDifficulty(
  questions: Question[],
  currentIndex: number,
  targetDifficulty: number,
): number {
  const total = questions.length;

  for (let step = 1; step <= total; step++) {
    const index = (currentIndex + step) % total;

    if (questions[index]?.difficultyLevel === targetDifficulty) {
      return index;
    }
  }

  return (currentIndex + 1) % total;
}