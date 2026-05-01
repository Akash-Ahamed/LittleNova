# 🌟 LittleNova

AI-powered adaptive learning app for kids (Ages 3--7) built with React
Native + Expo.

------------------------------------------------------------------------

## 🚀 Overview

LittleNova is a personalized learning app that adapts to each child's
performance using a lightweight AI Agent.

It dynamically adjusts: - Difficulty level - Question sequence - Hints
and pacing

All logic runs **offline on-device**, ensuring fast and reliable
performance without internet dependency.

------------------------------------------------------------------------

## 🧠 AI Agent (Core Feature)

LittleNova uses an adaptive AI loop:

    Perceive → Think → Act

### 🔍 Perceive

Collects user activity data: - Accuracy - Response time - Correct /
Wrong streak - Total attempts

### 🧠 Think

Analyzes performance and decides: - Increase or decrease difficulty -
Show hints or not - Adjust pacing

### ⚡ Act

Executes decisions: - Selects next question - Triggers UI changes (hint,
delay, etc.)

------------------------------------------------------------------------

## 📱 Features

-   🎯 Adaptive difficulty system
-   🧠 Real-time learning analysis
-   🎮 Gamified rewards (stars + confetti)
-   🔊 Audio feedback
-   📶 Fully offline (no API required)
-   👶 Kid-friendly UI design

------------------------------------------------------------------------

## 🧩 Modules

### Numbers (1--20)

-   Count objects
-   Match quantity to digit
-   Number sequencing

### ABC & Phonics *(Planned)*

### Shapes & Colors *(Planned)*

------------------------------------------------------------------------

## 🏗️ Tech Stack

  Category           Technology
  ------------------ -----------------------------------------
  Mobile             React Native (Expo)
  Language           JavaScript + TypeScript (AI Agent only)
  State Management   Zustand
  Animation          React Native Reanimated
  Audio              Expo Audio
  Storage            AsyncStorage

------------------------------------------------------------------------

## 📂 Project Structure

    src/
    ├─ agent/        # AI logic (TypeScript)
    ├─ hooks/        # Game logic & interaction
    ├─ components/   # UI components
    ├─ screens/      # App screens
    ├─ store/        # Zustand global state
    ├─ data/         # Questions & configs

------------------------------------------------------------------------

## 🛠️ Setup & Run

``` bash
npm install
npx expo start -c
```

------------------------------------------------------------------------

## 🧪 Testing

``` bash
npm test
```

------------------------------------------------------------------------

## 🔍 Debug Features

-   AI Debug Overlay (streak, accuracy, difficulty)
-   Console logs for AI decision tracking

------------------------------------------------------------------------

## 🚀 Future Improvements

-   Voice assistant (AI mascot)
-   Parent dashboard
-   More learning modules
-   Localization (Bangla)

------------------------------------------------------------------------

## 👨‍💻 Author

Akash Ahamed
Junior Software Engineer