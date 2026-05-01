// ALL thresholds in one place — no magic numbers anywhere else.

export const AGENT_CONFIG = {
  // ── Streak thresholds ───────────────────────────────────────────────────
  WRONG_STREAK_FOR_HINT:       2,   // show hint after 2 wrong on same question
  CORRECT_STREAK_TO_LEVEL_UP:  3,   // jump to harder after 3 correct in a row

  // ── Accuracy thresholds ─────────────────────────────────────────────────
  LOW_ACCURACY_THRESHOLD:      0.40, // below = struggling
  HIGH_ACCURACY_THRESHOLD:     0.70, // above = excelling

  // ── Response time thresholds (ms) ───────────────────────────────────────
  FAST_RESPONSE_MS:            3000, // under = child is confident
  SLOW_RESPONSE_MS:            9000, // over = child needs more time

  // ── Timing (ms) ─────────────────────────────────────────────────────────
  NEXT_QUESTION_DELAY_MS:      5500, // normal wait before next question
  SLOW_DOWN_EXTRA_MS:          1500, // added when shouldSlowDown = true
  AUDIO_START_DELAY_MS:        700,  // delay before question audio plays
  CONFETTI_DURATION_MS:        1500, // how long celebration shows

  // ── Difficulty bounds ───────────────────────────────────────────────────
  MIN_DIFFICULTY:              1,
  MAX_DIFFICULTY:              3,
} as const;