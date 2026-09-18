# Contributing to RepShade

Thank you for your interest in contributing to **RepShade**! We welcome contributions from developers, designers, lifters, and fitness enthusiasts of all experience levels.

This document outlines the guidelines and best practices for contributing to the RepShade codebase and documentation.

---

## 📜 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [How Can I Contribute?](#-how-can-i-contribute)
3. [Local Development Setup](#-local-development-setup)
4. [Git Workflow & Branching](#-git-workflow--branching)
5. [Coding Standards](#-coding-standards)
6. [Testing & QA](#-testing--qa)
7. [Submitting a Pull Request](#-submitting-a-pull-request)
8. [Community & Communication](#-community--communication)

---

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](file:///c:/Projects/RepShade/CODE_OF_CONDUCT.md). Please read it to understand expected behaviors and reporting protocols.

---

## 💡 How Can I Contribute?

- **Report Bugs**: Help us find issues in workout logging, timer calculations, or sync failures.
- **Suggest Features**: Propose new routine options, exercise definitions, or analytics visualizers.
- **Submit Pull Requests**: Implement bug fixes, performance optimizations, or UI design updates.
- **Improve Documentation**: Enhance developer guides, API specifications, or setup walkthroughs.
- **Design & UI/UX**: Help refine our **Dark Performance Design System** screens.

---

## 🛠️ Local Development Setup

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm** or **yarn** or **pnpm**
- **Expo CLI**: Installed globally or executed via `npx expo`
- **Mobile Emulator or Device**:
  - Android Studio (for Android Emulator)
  - Xcode (macOS only, for iOS Simulator)
  - Expo Go app on physical iOS/Android device

### Step-by-Step Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RepShade.git
   cd RepShade
   ```

2. **Install Application Dependencies**:
   ```bash
   cd Repshade
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment template and populate your local Firebase development keys (if testing cloud sync):
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server**:
   ```bash
   npm run start
   # or npx expo start
   ```

5. **Run on Platform**:
   - Press `a` in the terminal for Android Emulator.
   - Press `i` in the terminal for iOS Simulator (macOS only).
   - Scan the QR code with **Expo Go** on your physical phone.

---

## 🌿 Git Workflow & Branching

We follow a feature-branch git strategy. All production-ready code lives on the `main` branch.

### Branch Naming Conventions
- `feature/short-description` — New features or UX changes
- `fix/short-description` — Bug fixes
- `docs/short-description` — Documentation improvements
- `refactor/short-description` — Code cleanup without behavior changes
- `test/short-description` — Unit or integration test additions

### Commit Message Guidelines
Use clear, imperative commit messages (conventional commits preferred):
- `feat(routine): add Arnold split routine template`
- `fix(timer): resolve background notification delay on Android`
- `docs(readme): add environment variable setup instructions`
- `style(ui): update rest timer progress circle colors`

---

## 🎨 Coding Standards

RepShade is built with **TypeScript**, **Expo SDK 57**, **React Native**, **Zustand**, and **Expo SQLite**.

- **TypeScript**: Always enable strict mode. Avoid explicit `any` types. Define explicit interfaces for models (Routines, Workouts, Sets, Exercises).
- **React Components**: Use functional components with hooks. Keep presentation UI decoupled from business state where possible.
- **State Management**: Use Zustand for client state and local SQLite storage for offline persistence.
- **Design System**: Adhere to the **Dark Performance Theme** color tokens (#000000 background, high contrast text, vibrant electric green/accent highlights).

---

## 🧪 Testing & QA

Always verify your changes before submitting a PR.

### Run Linting:
```bash
npm run lint
```

### Run Unit Tests:
```bash
npm test
```

For full test coverage guidelines, consult the comprehensive [Testing & QA Specification](file:///c:/Projects/RepShade/Docs/TESTING-QA.md).

---

## 🚀 Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the official repository.
3. Fill out the PR template completely:
   - Clear summary of changes
   - Link to related issues (e.g., `Closes #42`)
   - Screenshots/Videos for UI changes
   - Checklist verification (linted, tested, formatted)
4. Respond to feedback from maintainers during code review.

---

## 💬 Community & Communication

Have questions or ideas?
- Open a discussion thread under GitHub Discussions.
- Report bugs or request features via GitHub Issues.

Thank you for helping build **RepShade**! 💪⚡
