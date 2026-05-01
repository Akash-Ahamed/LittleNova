// Global state — all screens and all activity hooks read/write here.
// Zustand store with AsyncStorage persistence.

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateChildState } from '../agent/engine';

const STORAGE_KEY = 'little_nova_child_progress_v1';

// ── Default state ─────────────────────────────────────────────────────────────
const DEFAULT_CHILD_STATE = {
  totalAttempts:      0,
  correctStreak:      0,
  wrongStreak:        0,
  accuracy:           1.0,
  avgResponseTime:    0,
  difficultyByActivity: {
    count_objects:   1,
    match_quantity:  1,
    tap_in_order:    1,
    missing_numbers: 1,
    trace_letters:   1,
    match_sound:     1,
    identify_shapes: 1,
    sort_by_color:   1,
  },
  lastSessionDate: '',
};

const useProgressStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  childState:         { ...DEFAULT_CHILD_STATE },
  starsByModule:      { numbers: 0, abc: 0, shapes: 0 },
  completedQuestions: [],
  sessionHistory:     [],
  isLoaded:           false,

  // ── LOAD — call once in App.js on mount ───────────────────────────────────
  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // Merge saved difficultyByActivity with defaults
        // so new activities added later get difficulty 1 automatically
        const mergedDifficulty = {
          ...DEFAULT_CHILD_STATE.difficultyByActivity,
          ...(saved.childState?.difficultyByActivity ?? {}),
        };
        set({
          ...saved,
          childState: {
            ...DEFAULT_CHILD_STATE,
            ...saved.childState,
            difficultyByActivity: mergedDifficulty,
          },
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.warn('[MindBloom] Failed to load progress:', e);
      set({ isLoaded: true });
    }
  },

  // ── SAVE — called internally after every state change ─────────────────────
  _persist: async () => {
    const { childState, starsByModule, completedQuestions, sessionHistory } = get();
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ childState, starsByModule, completedQuestions, sessionHistory })
      );
    } catch (e) {
      console.warn('[MindBloom] Failed to save progress:', e);
    }
  },

  // ── RECORD ANSWER — called by every activity hook ─────────────────────────
  // activityType: 'count_objects' | 'match_quantity' | etc.
  recordAnswer: (questionId, isCorrect, responseTimeMs, activityType) => {
    set((state) => {
      const newChildState = updateChildState(
        state.childState,
        isCorrect,
        responseTimeMs,
        activityType,
      );

      const newHistory = [
        ...state.sessionHistory,
        {
          questionId,
          activityType,
          correct:      isCorrect,
          responseTime: responseTimeMs,
          timestamp:    Date.now(),
        },
      ];

      const newCompleted =
        isCorrect && !state.completedQuestions.includes(questionId)
          ? [...state.completedQuestions, questionId]
          : state.completedQuestions;

      return {
        childState:         newChildState,
        sessionHistory:     newHistory,
        completedQuestions: newCompleted,
      };
    });

    // Write to disk immediately — don't wait for app close
    get()._persist();
  },

  // ── AWARD STARS — call after lesson completion ────────────────────────────
  addStars: (module, stars) => {
    set((state) => ({
      starsByModule: {
        ...state.starsByModule,
        [module]: Math.max(state.starsByModule[module] ?? 0, stars),
      },
    }));
    get()._persist();
  },

  // ── RESET — for testing or new child profile ──────────────────────────────
  resetProgress: async () => {
    set({
      childState:         { ...DEFAULT_CHILD_STATE },
      starsByModule:      { numbers: 0, abc: 0, shapes: 0 },
      completedQuestions: [],
      sessionHistory:     [],
    });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
}));

export default useProgressStore;