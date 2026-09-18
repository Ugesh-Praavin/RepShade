import { NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';

const { WorkoutTimerModule } = NativeModules;

export interface TimerStatus {
  isRunning: boolean;
  isPaused: boolean;
  sessionId: string | null;
  workoutName: string | null;
  startedAt: number;
  elapsedSeconds: number;
}

export interface PendingCompletedWorkout {
  hasPending: boolean;
  sessionId: string | null;
  durationSeconds: number;
  completedAt: number;
}

export interface WorkoutStoppedEvent {
  sessionId: string;
  durationSeconds: number;
  stoppedAt: number;
}

const isSupportedPlatform = Platform.OS === 'android' || Platform.OS === 'ios';

class WorkoutTimerService {
  private eventEmitter: NativeEventEmitter | null = null;

  constructor() {
    if (isSupportedPlatform && WorkoutTimerModule) {
      this.eventEmitter = new NativeEventEmitter(WorkoutTimerModule);
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!isSupportedPlatform) return true;

    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33 && typeof PermissionsAndroid?.check === 'function') {
          const alreadyGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (alreadyGranted) return true;

          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } else if (Platform.OS === 'ios' && WorkoutTimerModule?.requestNotificationPermission) {
        return await WorkoutTimerModule.requestNotificationPermission();
      }
      return true;
    } catch (e) {
      console.warn('Failed to request notification permission:', e);
      return false;
    }
  }

  async startTimer(sessionId: string, workoutName: string, startedAtMs: number): Promise<boolean> {
    if (!isSupportedPlatform || !WorkoutTimerModule) return false;
    try {
      await this.requestNotificationPermission().catch(() => {});
      return await WorkoutTimerModule.startTimer(sessionId, workoutName, startedAtMs);
    } catch (e) {
      console.warn('Failed to start workout timer service:', e);
      return false;
    }
  }

  async pauseTimer(elapsedSeconds: number): Promise<boolean> {
    if (!isSupportedPlatform || !WorkoutTimerModule) return false;
    try {
      return await WorkoutTimerModule.pauseTimer(elapsedSeconds);
    } catch (e) {
      console.warn('Failed to pause workout timer service:', e);
      return false;
    }
  }

  async resumeTimer(): Promise<boolean> {
    if (!isSupportedPlatform || !WorkoutTimerModule) return false;
    try {
      return await WorkoutTimerModule.resumeTimer();
    } catch (e) {
      console.warn('Failed to resume workout timer service:', e);
      return false;
    }
  }

  async stopTimer(): Promise<boolean> {
    if (!isSupportedPlatform || !WorkoutTimerModule) return false;
    try {
      return await WorkoutTimerModule.stopTimer();
    } catch (e) {
      console.warn('Failed to stop workout timer service:', e);
      return false;
    }
  }

  async getTimerStatus(): Promise<TimerStatus> {
    if (!isSupportedPlatform || !WorkoutTimerModule) {
      return {
        isRunning: false,
        isPaused: false,
        sessionId: null,
        workoutName: null,
        startedAt: 0,
        elapsedSeconds: 0,
      };
    }
    try {
      return await WorkoutTimerModule.getTimerStatus();
    } catch (e) {
      console.warn('Failed to get timer status:', e);
      return {
        isRunning: false,
        isPaused: false,
        sessionId: null,
        workoutName: null,
        startedAt: 0,
        elapsedSeconds: 0,
      };
    }
  }

  async getPendingCompletedWorkout(): Promise<PendingCompletedWorkout> {
    if (!isSupportedPlatform || !WorkoutTimerModule) {
      return {
        hasPending: false,
        sessionId: null,
        durationSeconds: 0,
        completedAt: 0,
      };
    }
    try {
      return await WorkoutTimerModule.getPendingCompletedWorkout();
    } catch (e) {
      console.warn('Failed to get pending completed workout:', e);
      return {
        hasPending: false,
        sessionId: null,
        durationSeconds: 0,
        completedAt: 0,
      };
    }
  }

  async clearPendingCompletedWorkout(): Promise<boolean> {
    if (!isSupportedPlatform || !WorkoutTimerModule) return true;
    try {
      return await WorkoutTimerModule.clearPendingCompletedWorkout();
    } catch (e) {
      console.warn('Failed to clear pending completed workout:', e);
      return false;
    }
  }

  subscribeToWorkoutTimerStopped(callback: (data: WorkoutStoppedEvent) => void): () => void {
    if (!this.eventEmitter) return () => {};
    const subscription = this.eventEmitter.addListener('onWorkoutTimerStopped', callback);
    return () => {
      subscription.remove();
    };
  }
}

export const workoutTimerService = new WorkoutTimerService();
