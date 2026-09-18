module.exports = {
  Platform: {
    OS: 'android',
    Version: 34,
    select: (obj) => obj.android || obj.default,
  },
  NativeModules: {
    WorkoutTimerModule: {
      startTimer: jest.fn().mockResolvedValue(true),
      pauseTimer: jest.fn().mockResolvedValue(true),
      resumeTimer: jest.fn().mockResolvedValue(true),
      stopTimer: jest.fn().mockResolvedValue(true),
      getTimerStatus: jest.fn().mockResolvedValue({
        isRunning: false,
        isPaused: false,
        sessionId: null,
        workoutName: null,
        startedAt: 0,
        elapsedSeconds: 0,
      }),
      getPendingCompletedWorkout: jest.fn().mockResolvedValue({
        hasPending: false,
        sessionId: null,
        durationSeconds: 0,
        completedAt: 0,
      }),
      clearPendingCompletedWorkout: jest.fn().mockResolvedValue(true),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  })),
  PermissionsAndroid: {
    PERMISSIONS: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
    request: jest.fn().mockResolvedValue('granted'),
  },
  AppState: {
    addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  },
};
