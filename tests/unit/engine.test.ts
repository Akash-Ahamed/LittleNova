import { perceive, think, act, updateChildState } from '../../src/agent/engine';
import type { ChildState, Question } from '../../src/agent/types';

const BASE_STATE: ChildState = {
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

const QUESTIONS: Question[] = [
  { id: 'q1', activityType: 'count_objects', difficultyLevel: 1, correct: 2, options: [1,2,3] },
  { id: 'q2', activityType: 'count_objects', difficultyLevel: 1, correct: 3, options: [2,3,4] },
  { id: 'q3', activityType: 'count_objects', difficultyLevel: 2, correct: 5, options: [4,5,6] },
  { id: 'q4', activityType: 'count_objects', difficultyLevel: 3, correct: 9, options: [7,9,11] },
];

describe('perceive()', () => {
  it('returns struggling when wrong streak >= 2', () => {
    const state = { ...BASE_STATE, wrongStreak: 2 };
    expect(perceive(state, 'count_objects')).toBe('struggling');
  });

  it('returns struggling when accuracy < 0.5', () => {
    const state = { ...BASE_STATE, accuracy: 0.4 };
    expect(perceive(state, 'count_objects')).toBe('struggling');
  });

  it('returns excelling when correct streak >= 3 and high accuracy', () => {
    const state = { ...BASE_STATE, correctStreak: 3, accuracy: 0.9 };
    expect(perceive(state, 'count_objects')).toBe('excelling');
  });

  it('returns on_track by default', () => {
    expect(perceive(BASE_STATE, 'count_objects')).toBe('on_track');
  });

  it('returns on_track at max difficulty even with high streak', () => {
    const state = {
      ...BASE_STATE,
      correctStreak: 5,
      accuracy: 0.95,
      difficultyByActivity: { ...BASE_STATE.difficultyByActivity, count_objects: 3 },
    };
    expect(perceive(state, 'count_objects')).toBe('on_track');
  });
});

describe('think()', () => {
  it('struggling → returns shouldShowHint and shouldSlowDown', () => {
    const d = think('struggling', QUESTIONS, 2, 'count_objects');
    expect(d.shouldShowHint).toBe(true);
    expect(d.shouldSlowDown).toBe(true);
  });

  it('excelling → harder question, no hint', () => {
    const d = think('excelling', QUESTIONS, 1, 'count_objects');
    expect(d.shouldShowHint).toBe(false);
    expect(QUESTIONS[d.nextQuestionIndex].difficultyLevel).toBeGreaterThan(1);
  });

  it('on_track → next index', () => {
    const d = think('on_track', QUESTIONS, 1, 'count_objects');
    expect(d.nextQuestionIndex).toBe(2);
  });

  it('on_track at last question → stays at last', () => {
    const d = think('on_track', QUESTIONS, 3, 'count_objects');
    expect(d.nextQuestionIndex).toBe(3);
  });
});

describe('updateChildState()', () => {
  it('increments correctStreak on correct answer', () => {
    const next = updateChildState(BASE_STATE, true, 2000, 'count_objects');
    expect(next.correctStreak).toBe(1);
    expect(next.wrongStreak).toBe(0);
  });

  it('resets correctStreak on wrong answer', () => {
    const withStreak = { ...BASE_STATE, correctStreak: 2 };
    const next = updateChildState(withStreak, false, 5000, 'count_objects');
    expect(next.correctStreak).toBe(0);
    expect(next.wrongStreak).toBe(1);
  });

  it('increases activity difficulty after 3 correct in a row', () => {
    let state = BASE_STATE;
    state = updateChildState(state, true, 2000, 'count_objects');
    state = updateChildState(state, true, 2000, 'count_objects');
    state = updateChildState(state, true, 2000, 'count_objects');
    expect(state.difficultyByActivity['count_objects']).toBe(2);
  });

  it('does not affect other activity difficulties', () => {
    const next = updateChildState(BASE_STATE, true, 2000, 'count_objects');
    expect(next.difficultyByActivity['match_quantity']).toBe(1);
  });

  it('rolling accuracy is correct after 4 answers (3 correct, 1 wrong)', () => {
    let state = BASE_STATE;
    state = updateChildState(state, true,  2000, 'count_objects'); // 1/1 = 1.0
    state = updateChildState(state, true,  2000, 'count_objects'); // 2/2 = 1.0
    state = updateChildState(state, false, 5000, 'count_objects'); // 2/3 = 0.666
    state = updateChildState(state, true,  2000, 'count_objects'); // 3/4 = 0.75
    expect(state.accuracy).toBeCloseTo(0.75, 2);
  });
});