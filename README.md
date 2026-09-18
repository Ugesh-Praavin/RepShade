<div align="center">

# 🏋️‍♂️ REPSHADE

### Sequence-Based Workout Tracking & Performance Engine for Lifters

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](file:///c:/Projects/RepShade/LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000000.svg?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](file:///c:/Projects/RepShade/CONTRIBUTING.md)

*Train consistently, track every set, and progress without being bound by the calendar.*

[Key Features](#-key-features) • [Core Philosophy](#-core-philosophy) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

</div>

## 💡 Core Philosophy: Sequence-Based Training

Most workout trackers tie routines to specific days of the week:

> *Monday: Push | Tuesday: Pull | Wednesday: Legs | Thursday: Rest*

When life gets in the way and you miss Tuesday and Wednesday, traditional apps shift you to Thursday's workout or force manual calendar adjustments. **RepShade eliminates calendar friction**.

RepShade tracks your **actual training sequence**:
```text
Push  ──► [ Missed 2 Days ] ──► Pull  ──► Legs  ──► Push
```
If you complete **Push** and don't work out for two days, RepShade remembers your exact progression. Your next session is **Pull** — zero manual rescheduling, zero calendar guilt.

---

## ✨ Key Features

- 🔄 **Sequence-Based Routine Engine**: Automatically queues your next workout split (Push/Pull/Legs, Upper/Lower, Arnold Split, or Custom) based on completed history.
- ⚡ **Zero-Friction Live Tracker**: Logging sets takes a single tap with pre-filled ghost values from your previous workout.
- ⏱️ **Dynamic Rest Timer**: Automated, customizable rest timers with background notifications and progress visualization.
- 💾 **Offline-First Architecture**: Powered by **Expo SQLite** for ultra-fast local logging without needing an internet connection.
- ☁️ **Cloud Synchronization**: Background synchronization with Firebase Firestore ensures seamless backup and multi-device access.
- 📊 **Progress Analytics & 1RM Calculator**: Automated Epley 1RM estimation, volume breakdown by muscle group, and PR celebrations.
- 🌙 **Dark Performance UI**: Minimalist, high-contrast dark theme designed specifically for low-light gym environments.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 57)
- **Routing**: [Expo Router v4](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Local Persistence**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Backend & Cloud Sync**: [Firebase Auth & Firestore](https://firebase.google.com/)
- **UI & Icons**: [Lucide React Native Icons](https://lucide.dev/), Custom Dark Performance Design System
- **Language**: TypeScript (Strict Mode)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) LTS (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- **Expo Go** app on your physical mobile device, OR an Android Emulator / iOS Simulator.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RepShade.git
   cd RepShade
   ```

2. **Install Dependencies**:
   ```bash
   cd Repshade
   npm install
   ```

3. **Set Up Environment Variables**:
   Copy `.env.example` to `.env` inside the `Repshade` folder:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Bundler**:
   ```bash
   npm start
   ```

5. **Run on Emulator / Device**:
   - Press `a` to launch on **Android Emulator**.
   - Press `i` to launch on **iOS Simulator** (macOS required).
   - Scan the terminal QR code with **Expo Go** on your mobile device.

---

## 🏗️ Architecture & Project Structure

The repository is structured into three primary spaces:

```text
RepShade/
├── Repshade/                            # 📱 Main React Native / Expo Mobile Application
│   ├── app/                             # Expo Router file-based screens & navigation
│   ├── src/                             # Core UI components, Zustand stores, SQLite & Firebase services
│   ├── firebase/                        # Firebase config & sync handlers
│   └── tests/                           # Unit and integration test specs
│
├── Docs/                                # 📚 Complete Technical Specifications & Architecture Docs
│   ├── PRD.md                           # Product Requirement Document
│   ├── ARCHITECTURE.md                  # System Architecture & Component Interactions
│   ├── DATABASEARCH.md                  # SQLite Schema & Offline-First Sync Engine
│   ├── DESIGNSYSTEM.md                  # UI/UX Token System & Dark Performance Theme
│   ├── SCREEN-BY-SCREEN-UIUX-SPEC.md    # Screen-by-Screen User Flows & State Specs
│   ├── TESTING-QA.md                    # QA Matrix, Unit Test Specs & E2E Strategy
│   └── Repshade-Product-vision-and-mission.md
│
└── repshade_workout_app_design_system/  # 🎨 Standalone HTML/CSS Design System Mockups (24 Screens)
```

---

## 📚 Technical Documentation Index

For deep-dive technical specs, review the comprehensive documents inside the [`Docs/`](file:///c:/Projects/RepShade/Docs) directory:

1. 📄 [Product Vision & Mission](file:///c:/Projects/RepShade/Docs/Repshade-Product-vision-and-mission.md) — Product concept, brand identity & target lifter persona.
2. 📄 [Product Requirements (PRD)](file:///c:/Projects/RepShade/Docs/PRD.md) — Functional requirements, core user stories, non-functional targets.
3. 📄 [System Architecture](file:///c:/Projects/RepShade/Docs/ARCHITECTURE.md) — Architecture diagrams, data flow pipelines, state model.
4. 📄 [Database Architecture](file:///c:/Projects/RepShade/Docs/DATABASEARCH.md) — SQLite database schema, sync conflicts resolution, migrations.
5. 📄 [Design System Specification](file:///c:/Projects/RepShade/Docs/DESIGNSYSTEM.md) — Color palettes, typography, spacing, component library guidelines.
6. 📄 [Screen-by-Screen UI/UX Spec](file:///c:/Projects/RepShade/Docs/SCREEN-BY-SCREEN-UIUX-SPEC.md) — Detailed interaction specs for all 24 app screens.
7. 📄 [Testing & QA Specification](file:///c:/Projects/RepShade/Docs/TESTING-QA.md) — Automated test suite, manual QA checklists, edge case matrices.
8. 📄 [Implementation Plan](file:///c:/Projects/RepShade/Docs/REPSHADE-IMPLEMENTATION.md) — Full feature rollout timeline & milestones.

---

## 🤝 Contributing

We welcome contributions of all kinds! Whether you're fixing a bug, designing new screens, or improving documentation:

1. Read our [Contributing Guide](file:///c:/Projects/RepShade/CONTRIBUTING.md).
2. Check out open issues or submit a feature proposal using our [Issue Templates](file:///c:/Projects/RepShade/.github/ISSUE_TEMPLATE).
3. Follow the [Code of Conduct](file:///c:/Projects/RepShade/CODE_OF_CONDUCT.md) in all community interactions.

---

## 📄 License

RepShade is open-source software licensed under the [MIT License](file:///c:/Projects/RepShade/LICENSE).

---

<div align="center">

Made with ❤️ by fitness enthusiasts & open-source contributors.

</div>
