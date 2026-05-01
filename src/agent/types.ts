export type LearningStatus = 'struggling' | 'on_track' | 'excelling';

export type ActivityType =
  | 'count_objects'
  | 'match_quantity'
  | 'tap_in_order'
  | 'missing_numbers'
  | 'trace_letters'
  | 'match_sound'
  | 'identify_shapes'
  | 'sort_by_color';


// Stored in Zustand + AsyncStorage — persists across sessions
export interface ChildState {
  totalAttempts:      number;
  correctStreak:      number;   // consecutive correct answers
  wrongStreak:        number;   // consecutive wrong on CURRENT question
  accuracy:           number;   // rolling 0.0 – 1.0
  avgResponseTime:    number;   // rolling ms average
  // Per-activity difficulty so each activity tracks independently
  difficultyByActivity: Record<ActivityType, number>;
  lastSessionDate:    string;   // ISO date string
}

// Shape of each question — all activities follow this contract
export interface Question {
  id:             string;
  activityType:   ActivityType;
  difficultyLevel: 1 | 2 | 3;
  correct:        number | string;
  options:        (number | string)[];
  objectName?:    string;       // e.g. "cat" — used in hint audio
  numberRange?:   [number, number]; // e.g. [1, 5]
  image?:         unknown;
  imageStyle?:    { scale: number; translateX: number; translateY: number };
  audio?:         unknown;
  hintAudio?:     unknown;
}

// What the agent returns to the hook after every correct answer
export interface AgentDecision {
  nextQuestionIndex: number;
  shouldShowHint:    boolean;
  shouldSlowDown:    boolean;
  reason:            string;    // for debug logging
}