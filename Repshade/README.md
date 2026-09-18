# RepShade Mobile Application 🏋️‍♂️⚡

This directory contains the main React Native & Expo mobile application codebase for **RepShade**.

For full project architecture, product vision, contributing guidelines, and design system documentation, please visit the [Root Repository README](file:///c:/Projects/RepShade/README.md).

---

## 📁 Application Architecture

```text
Repshade/
├── app/                  # Expo Router file-based screen routes
│   ├── (tabs)/          # Main navigation tab screens (Home, Routine, History, Profile)
│   ├── workout/         # Active workout tracking session screens
│   └── _layout.tsx      # Global app layout & theme providers
├── src/
│   ├── components/      # Reusable Dark Performance UI components & widgets
│   ├── context/         # React Context providers (Auth, Theme)
│   ├── services/        # SQLite storage engine & Firebase Cloud Sync APIs
│   ├── store/           # Zustand state stores (routineStore, workoutStore)
│   ├── types/           # TypeScript interfaces (Exercise, Set, Routine, History)
│   └── utils/           # Formatters, 1RM calculators, rest timer helpers
├── firebase/            # Firebase SDK configuration & offline sync handlers
├── assets/              # App icon, splash screen, fonts, icons
├── tests/               # Jest unit tests & integration specs
└── app.json             # Expo project configuration
```

---

## 🚀 Quick Start (App Only)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Bundler**:
   ```bash
   npm start
   ```

4. **Available Commands**:
   - `npm run android`: Run on connected Android device or emulator.
   - `npm run ios`: Run on iOS simulator (macOS required).
   - `npm run web`: Run in web browser preview.
   - `npm run lint`: Run ESLint checks.
   - `npm test`: Run Jest unit tests.
