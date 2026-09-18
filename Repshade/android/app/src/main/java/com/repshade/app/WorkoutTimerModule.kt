package com.repshade.app

import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.ref.WeakReference

class WorkoutTimerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val MODULE_NAME = "WorkoutTimerModule"
        private var reactContextRef: WeakReference<ReactApplicationContext>? = null

        fun notifyWorkoutStopped(sessionId: String, durationSeconds: Int, stoppedAt: Long) {
            val context = reactContextRef?.get() ?: return
            try {
                if (context.hasActiveReactInstance()) {
                    val params = Arguments.createMap().apply {
                        putString("sessionId", sessionId)
                        putInt("durationSeconds", durationSeconds)
                        putDouble("stoppedAt", stoppedAt.toDouble())
                    }
                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        ?.emit("onWorkoutTimerStopped", params)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    init {
        reactContextRef = WeakReference(reactContext)
    }

    override fun getName(): String = MODULE_NAME

    @ReactMethod
    fun startTimer(sessionId: String, workoutName: String, startedAtMs: Double, promise: Promise) {
        try {
            val intent = Intent(reactContext, WorkoutTimerService::class.java).apply {
                action = WorkoutTimerService.ACTION_START
                putExtra("sessionId", sessionId)
                putExtra("workoutName", workoutName)
                putExtra("startedAt", startedAtMs.toLong())
            }

            ContextCompat.startForegroundService(reactContext, intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("START_TIMER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun pauseTimer(elapsedSeconds: Int, promise: Promise) {
        try {
            val intent = Intent(reactContext, WorkoutTimerService::class.java).apply {
                action = WorkoutTimerService.ACTION_PAUSE
                putExtra("elapsedSeconds", elapsedSeconds)
            }
            reactContext.startService(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("PAUSE_TIMER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun resumeTimer(promise: Promise) {
        try {
            val intent = Intent(reactContext, WorkoutTimerService::class.java).apply {
                action = WorkoutTimerService.ACTION_RESUME
            }
            reactContext.startService(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("RESUME_TIMER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopTimer(promise: Promise) {
        try {
            val intent = Intent(reactContext, WorkoutTimerService::class.java).apply {
                action = WorkoutTimerService.ACTION_STOP
            }
            reactContext.stopService(intent)

            val prefs = WorkoutTimerService.getPrefs(reactContext)
            prefs.edit()
                .putBoolean(WorkoutTimerService.KEY_IS_RUNNING, false)
                .putBoolean(WorkoutTimerService.KEY_IS_PAUSED, false)
                .apply()

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_TIMER_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getTimerStatus(promise: Promise) {
        try {
            val prefs = WorkoutTimerService.getPrefs(reactContext)
            val isRunning = prefs.getBoolean(WorkoutTimerService.KEY_IS_RUNNING, false)
            val isPaused = prefs.getBoolean(WorkoutTimerService.KEY_IS_PAUSED, false)
            val sessionId = prefs.getString(WorkoutTimerService.KEY_SESSION_ID, null)
            val workoutName = prefs.getString(WorkoutTimerService.KEY_WORKOUT_NAME, null)
            val startedAt = prefs.getLong(WorkoutTimerService.KEY_STARTED_AT, 0L)
            val elapsedSeconds = prefs.getInt(WorkoutTimerService.KEY_ELAPSED_SECONDS, 0)

            val result = Arguments.createMap().apply {
                putBoolean("isRunning", isRunning)
                putBoolean("isPaused", isPaused)
                putString("sessionId", sessionId)
                putString("workoutName", workoutName)
                putDouble("startedAt", startedAt.toDouble())
                putInt("elapsedSeconds", elapsedSeconds)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_STATUS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getPendingCompletedWorkout(promise: Promise) {
        try {
            val prefs = WorkoutTimerService.getPrefs(reactContext)
            val hasPending = prefs.getBoolean(WorkoutTimerService.KEY_HAS_PENDING_COMPLETION, false)
            val sessionId = prefs.getString(WorkoutTimerService.KEY_COMPLETED_SESSION_ID, null)
            val durationSeconds = prefs.getInt(WorkoutTimerService.KEY_COMPLETED_DURATION, 0)
            val completedAt = prefs.getLong(WorkoutTimerService.KEY_COMPLETED_AT, 0L)

            val result = Arguments.createMap().apply {
                putBoolean("hasPending", hasPending)
                putString("sessionId", sessionId)
                putInt("durationSeconds", durationSeconds)
                putDouble("completedAt", completedAt.toDouble())
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("GET_PENDING_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clearPendingCompletedWorkout(promise: Promise) {
        try {
            val prefs = WorkoutTimerService.getPrefs(reactContext)
            prefs.edit()
                .putBoolean(WorkoutTimerService.KEY_HAS_PENDING_COMPLETION, false)
                .remove(WorkoutTimerService.KEY_COMPLETED_DURATION)
                .remove(WorkoutTimerService.KEY_COMPLETED_SESSION_ID)
                .remove(WorkoutTimerService.KEY_COMPLETED_AT)
                .apply()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CLEAR_PENDING_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN NativeEventEmitter
    }
}
