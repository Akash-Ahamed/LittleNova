// distractorGap rule:
//   difficultyLevel 1 → gap ≥ 3  (wrong answers obviously wrong)
//   difficultyLevel 2 → gap = 2  (moderate challenge)
//   difficultyLevel 3 → gap = 1  (requires precise counting)
//
// numberRange rule:
//   difficultyLevel 1 → [1, 5]   (1–5 objects in image)
//   difficultyLevel 2 → [6, 10]  (6–10 objects in image)
//   difficultyLevel 3 → [11, 20] (11–20 objects in image)

export const COUNT_OBJECT_QUESTIONS = [

  // ════════════════════════════════════════════════════════
  // DIFFICULTY LEVEL 1 — count range 1–5, distractorGap ≥ 3
  // Wrong answers are far apart — easy to eliminate at a glance
  // ════════════════════════════════════════════════════════

  {
    sequence:       'L1_1',
    id:             'catCount',
    objectName:     'cat',
    activityType:   'count_objects',
    difficultyLevel: 1,
    numberRange:    [1, 5],
    correct:        2,
    options:        [2, 6, 9],   // gap = min(|2-6|,|2-9|) = 4  
    distractorGap:  4,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L1_2',
    id:             'roosterCount',
    objectName:     'rooster',
    activityType:   'count_objects',
    difficultyLevel: 1,
    numberRange:    [1, 5],
    correct:        3,
    options:        [3, 7, 10],  // gap = min(|3-7|,|3-10|) = 4  
    distractorGap:  4,
    image:          require('../../../assets/Numbers/CountObjects/CountRooster.png'),
    imageStyle:     { scale: 0.45, translateX: 0.2, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountRooster.mp3'),
  },
  {
    sequence:       'L1_3',
    id:             'frogCount',
    objectName:     'frog',
    activityType:   'count_objects',
    difficultyLevel: 1,
    numberRange:    [1, 5],
    correct:        4,
    options:        [4, 8, 1],   // gap = min(|4-8|,|4-1|) = 3  
    distractorGap:  3,
    image:          require('../../../assets/Numbers/CountObjects/CountFrog.png'),
    imageStyle:     { scale: 0.45, translateX: 0.2, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountFrog.mp3'),
  },
  {
    sequence:       'L1_4',
    id:             'appleCount_L1',
    objectName:     'apple',
    activityType:   'count_objects',
    difficultyLevel: 1,
    numberRange:    [1, 5],
    correct:        1,
    options:        [1, 5, 9],   // gap = min(|1-5|,|1-9|) = 4  
    distractorGap:  4,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L1_5',
    id:             'starCount_L1',
    objectName:     'star',
    activityType:   'count_objects',
    difficultyLevel: 1,
    numberRange:    [1, 5],
    correct:        5,
    options:        [5, 1, 9],   // gap = min(|5-1|,|5-9|) = 4  
    distractorGap:  4,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L1_6',
    id:             'ballCount_L1',
    objectName:     'ball',
    activityType:   'count_objects',
    difficultyLevel: 1,
    numberRange:    [1, 5],
    correct:        3,
    options:        [3, 8, 11],  // gap = min(|3-8|,|3-11|) = 5  
    distractorGap:  5,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },

  // ════════════════════════════════════════════════════════
  // DIFFICULTY LEVEL 2 — count range 6–10, distractorGap = 2
  // Wrong answers are 2 away — child must count carefully
  // ════════════════════════════════════════════════════════

  {
    sequence:       'L2_1',
    id:             'fishCount_L2',
    objectName:     'fish',
    activityType:   'count_objects',
    difficultyLevel: 2,
    numberRange:    [6, 10],
    correct:        6,
    options:        [4, 6, 8],   // gap = min(|6-4|,|6-8|) = 2  
    distractorGap:  2,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L2_2',
    id:             'birdCount_L2',
    objectName:     'bird',
    activityType:   'count_objects',
    difficultyLevel: 2,
    numberRange:    [6, 10],
    correct:        8,
    options:        [6, 8, 10],  // gap = min(|8-6|,|8-10|) = 2  
    distractorGap:  2,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L2_3',
    id:             'flowerCount_L2',
    objectName:     'flower',
    activityType:   'count_objects',
    difficultyLevel: 2,
    numberRange:    [6, 10],
    correct:        10,
    options:        [8, 10, 12], // gap = min(|10-8|,|10-12|) = 2  
    distractorGap:  2,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },

  // ════════════════════════════════════════════════════════
  // DIFFICULTY LEVEL 3 — count range 11–20, distractorGap = 1
  // Wrong answers are 1 away — requires very precise counting
  // ════════════════════════════════════════════════════════

  {
    sequence:       'L3_1',
    id:             'leafCount_L3',
    objectName:     'leaf',
    activityType:   'count_objects',
    difficultyLevel: 3,
    numberRange:    [11, 20],
    correct:        12,
    options:        [11, 12, 13], // gap = min(|12-11|,|12-13|) = 1  
    distractorGap:  1,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L3_2',
    id:             'dotCount_L3',
    objectName:     'dot',
    activityType:   'count_objects',
    difficultyLevel: 3,
    numberRange:    [11, 20],
    correct:        15,
    options:        [14, 15, 16], // gap = min(|15-14|,|15-16|) = 1  
    distractorGap:  1,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
  {
    sequence:       'L3_3',
    id:             'stoneCount_L3',
    objectName:     'stone',
    activityType:   'count_objects',
    difficultyLevel: 3,
    numberRange:    [11, 20],
    correct:        18,
    options:        [17, 18, 19], // gap = min(|18-17|,|18-19|) = 1  
    distractorGap:  1,
    image:          require('../../../assets/Numbers/CountObjects/CountNumber_1.png'),
    imageStyle:     { scale: 1, translateX: 0, translateY: 0 },
    audio:          require('../../../assets/audio/Numbers/CountObject/CountCate.mp3'),
  },
];



