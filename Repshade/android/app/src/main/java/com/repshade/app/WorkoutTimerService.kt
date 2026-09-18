package com.repshade.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class WorkoutTimerService : Service() {

    companion object {
        const val ACTION_START = "com.repshade.app.ACTION_START"
        const val ACTION_PAUSE = "com.repshade.app.ACTION_PAUSE"
        const val ACTION_RESUME = "com.repshade.app.ACTION_RESUME"
        const val ACTION_STOP = "com.repshade.app.ACTION_STOP"
        const val ACTION_STOP_FROM_NOTIFICATION = "com.repshade.app.ACTION_STOP_FROM_NOTIFICATION"
        const val ACTION_PAUSE_FROM_NOTIFICATION = "com.repshade.app.ACTION_PAUSE_FROM_NOTIFICATION"
        const val ACTION_RESUME_FROM_NOTIFICATION = "com.repshade.app.ACTION_RESUME_FROM_NOTIFICATION"

        const val CHANNEL_ID = "repshade_workout_timer_channel"
        const val CHANNEL_NAME = "Workout Timer"
        const val NOTIFICATION_ID = 9901
        const val SUMMARY_NOTIFICATION_ID = 9902

        const val PREFS_NAME = "repshade_workout_timer_prefs"
        const val KEY_IS_RUNNING = "is_running"
        const val KEY_IS_PAUSED = "is_paused"
        const val KEY_SESSION_ID = "session_id"
        const val KEY_WORKOUT_NAME = "workout_name"
        const val KEY_STARTED_AT = "started_at"
        const val KEY_PAUSED_AT = "paused_at"
        const val KEY_TOTAL_PAUSED_MS = "total_paused_ms"
        const val KEY_ELAPSED_SECONDS = "elapsed_seconds"
        const val KEY_HAS_PENDING_COMPLETION = "has_pending_completion"
        const val KEY_COMPLETED_DURATION = "completed_duration_seconds"
        const val KEY_COMPLETED_AT = "completed_at"
        const val KEY_COMPLETED_SESSION_ID = "completed_session_id"

        fun getPrefs(context: Context): SharedPreferences {
            return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        }

        fun formatDuration(seconds: Int): String {
            val mins = seconds / 60
            val secs = seconds % 60
            val hrs = mins / 60
            return if (hrs > 0) {
                val remMins = mins % 60
                String.format("%d:%02d:%02d", hrs, remMins, secs)
            } else {
                String.format("%02d:%02d", mins, secs)
            }
        }

        fun stopWorkoutFromNotification(context: Context) {
            val prefs = getPrefs(context)
            val isRunning = prefs.getBoolean(KEY_IS_RUNNING, false)
            val sessionId = prefs.getString(KEY_SESSION_ID, "") ?: ""
            val workoutName = prefs.getString(KEY_WORKOUT_NAME, "Workout") ?: "Workout"
            val startedAt = prefs.getLong(KEY_STARTED_AT, System.currentTimeMillis())
            val totalPausedMs = prefs.getLong(KEY_TOTAL_PAUSED_MS, 0L)
            val isPaused = prefs.getBoolean(KEY_IS_PAUSED, false)
            val pausedAt = prefs.getLong(KEY_PAUSED_AT, 0L)

            val now = System.currentTimeMillis()
            val effectivePaused = totalPausedMs + if (isPaused && pausedAt > 0) (now - pausedAt) else 0L
            val elapsedMs = (now - startedAt - effectivePaused).coerceAtLeast(0L)
            val durationSeconds = (elapsedMs / 1000).toInt()

            prefs.edit()
                .putBoolean(KEY_IS_RUNNING, false)
                .putBoolean(KEY_IS_PAUSED, false)
                .putBoolean(KEY_HAS_PENDING_COMPLETION, true)
                .putInt(KEY_COMPLETED_DURATION, durationSeconds)
                .putLong(KEY_COMPLETED_AT, now)
                .putString(KEY_COMPLETED_SESSION_ID, sessionId)
                .putInt(KEY_ELAPSED_SECONDS, durationSeconds)
                .apply()

            // Stop the foreground service
            val stopIntent = Intent(context, WorkoutTimerService::class.java).apply {
                action = ACTION_STOP
            }
            context.stopService(stopIntent)

            // Notify React Native if alive
            WorkoutTimerModule.notifyWorkoutStopped(sessionId, durationSeconds, now)

            // Show a completion notification so user can tap to view summary
            showCompletionNotification(context, workoutName, durationSeconds)
        }

        private fun showCompletionNotification(context: Context, workoutName: String, durationSeconds: Int) {
            createNotificationChannel(context)

            val openIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("screen", "workout/summary")
                putExtra("from_notification", true)
            }
            val openPendingIntent = PendingIntent.getActivity(
                context,
                2001,
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val formatted = formatDuration(durationSeconds)
            try {
                val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                    .setContentTitle("Workout Completed! 🎉")
                    .setContentText("$workoutName • Duration: $formatted • Tap to view summary")
                    .setSmallIcon(R.drawable.ic_timer)
                    .setAutoCancel(true)
                    .setOngoing(false)
                    .setContentIntent(openPendingIntent)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .build()

                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.notify(SUMMARY_NOTIFICATION_ID, notification)
                notificationManager.cancel(NOTIFICATION_ID)
            } catch (e: Exception) {
                android.util.Log.e("WorkoutTimerService", "Error showing completion notification", e)
            }
        }

        fun createNotificationChannel(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                val existingChannel = notificationManager.getNotificationChannel(CHANNEL_ID)
                if (existingChannel == null) {
                    val channel = NotificationChannel(
                        CHANNEL_ID,
                        CHANNEL_NAME,
                        NotificationManager.IMPORTANCE_LOW
                    ).apply {
                        description = "Displays the running workout timer and controls"
                        setShowBadge(false)
                        enableVibration(false)
                        setSound(null, null)
                    }
                    notificationManager.createNotificationChannel(channel)
                }
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        try {
            createNotificationChannel(this)
            val action = intent?.action ?: ACTION_START

            when (action) {
                ACTION_START -> {
                    val sessionId = intent?.getStringExtra("sessionId") ?: ""
                    val workoutName = intent?.getStringExtra("workoutName") ?: "Active Workout"
                    val startedAt = intent?.getLongExtra("startedAt", System.currentTimeMillis()) ?: System.currentTimeMillis()

                    val prefs = getPrefs(this)
                    prefs.edit()
                        .putBoolean(KEY_IS_RUNNING, true)
                        .putBoolean(KEY_IS_PAUSED, false)
                        .putString(KEY_SESSION_ID, sessionId)
                        .putString(KEY_WORKOUT_NAME, workoutName)
                        .putLong(KEY_STARTED_AT, startedAt)
                        .putLong(KEY_TOTAL_PAUSED_MS, 0L)
                        .putBoolean(KEY_HAS_PENDING_COMPLETION, false)
                        .apply()

                    startForegroundWithNotification(workoutName, startedAt, isPaused = false, elapsedSeconds = 0)
                }
                ACTION_PAUSE -> {
                    val prefs = getPrefs(this)
                    val workoutName = prefs.getString(KEY_WORKOUT_NAME, "Active Workout") ?: "Active Workout"
                    val startedAt = prefs.getLong(KEY_STARTED_AT, System.currentTimeMillis())
                    val totalPausedMs = prefs.getLong(KEY_TOTAL_PAUSED_MS, 0L)
                    val now = System.currentTimeMillis()
                    val elapsed = ((now - startedAt - totalPausedMs) / 1000).toInt().coerceAtLeast(0)

                    prefs.edit()
                        .putBoolean(KEY_IS_PAUSED, true)
                        .putLong(KEY_PAUSED_AT, now)
                        .putInt(KEY_ELAPSED_SECONDS, elapsed)
                        .apply()

                    startForegroundWithNotification(workoutName, startedAt, isPaused = true, elapsedSeconds = elapsed)
                }
                ACTION_RESUME -> {
                    val prefs = getPrefs(this)
                    val workoutName = prefs.getString(KEY_WORKOUT_NAME, "Active Workout") ?: "Active Workout"
                    val startedAt = prefs.getLong(KEY_STARTED_AT, System.currentTimeMillis())
                    var totalPausedMs = prefs.getLong(KEY_TOTAL_PAUSED_MS, 0L)
                    val pausedAt = prefs.getLong(KEY_PAUSED_AT, 0L)
                    val now = System.currentTimeMillis()

                    if (pausedAt > 0) {
                        totalPausedMs += (now - pausedAt)
                    }

                    prefs.edit()
                        .putBoolean(KEY_IS_PAUSED, false)
                        .putLong(KEY_TOTAL_PAUSED_MS, totalPausedMs)
                        .putLong(KEY_PAUSED_AT, 0L)
                        .apply()

                    val effectiveStartTime = startedAt + totalPausedMs
                    startForegroundWithNotification(workoutName, effectiveStartTime, isPaused = false, elapsedSeconds = 0)
                }
                ACTION_STOP -> {
                    val prefs = getPrefs(this)
                    prefs.edit()
                        .putBoolean(KEY_IS_RUNNING, false)
                        .putBoolean(KEY_IS_PAUSED, false)
                        .apply()

                    try {
                        stopForeground(STOP_FOREGROUND_REMOVE)
                    } catch (e: Exception) {
                        // Ignore
                    }
                    stopSelf()
                }
            }
        } catch (e: Throwable) {
            android.util.Log.e("WorkoutTimerService", "Error in onStartCommand", e)
        }

        return START_STICKY
    }

    private fun startForegroundWithNotification(
        workoutName: String,
        baseTime: Long,
        isPaused: Boolean,
        elapsedSeconds: Int
    ) {
        try {
            createNotificationChannel(this)

            val openIntent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("screen", "workout/active")
            }
            val openPendingIntent = PendingIntent.getActivity(
                this,
                1001,
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val stopIntent = Intent(this, WorkoutTimerReceiver::class.java).apply {
                action = ACTION_STOP_FROM_NOTIFICATION
            }
            val stopPendingIntent = PendingIntent.getBroadcast(
                this,
                1002,
                stopIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val builder = NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Workout in Progress")
                .setSmallIcon(R.drawable.ic_timer)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setContentIntent(openPendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setCategory(NotificationCompat.CATEGORY_WORKOUT)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .addAction(R.drawable.ic_stop, "Stop Timer", stopPendingIntent)

            if (isPaused) {
                builder.setUsesChronometer(false)
                builder.setContentText("$workoutName • Paused (${formatDuration(elapsedSeconds)})")
            } else {
                builder.setUsesChronometer(true)
                builder.setWhen(baseTime)
                builder.setContentText(workoutName)
            }

            val notification = builder.build()

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                try {
                    startForeground(
                        NOTIFICATION_ID,
                        notification,
                        ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
                    )
                } catch (e1: Throwable) {
                    try {
                        startForeground(
                            NOTIFICATION_ID,
                            notification,
                            ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH
                        )
                    } catch (e2: Throwable) {
                        startForeground(NOTIFICATION_ID, notification)
                    }
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                try {
                    startForeground(
                        NOTIFICATION_ID,
                        notification,
                        ServiceInfo.FOREGROUND_SERVICE_TYPE_NONE
                    )
                } catch (e: Throwable) {
                    startForeground(NOTIFICATION_ID, notification)
                }
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
        } catch (t: Throwable) {
            android.util.Log.e("WorkoutTimerService", "Failed to startForeground notification", t)
        }
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        // App was swiped away from recent tasks, but user is in a workout.
        // Maintain the foreground service so the timer continues in background!
        val prefs = getPrefs(this)
        val isRunning = prefs.getBoolean(KEY_IS_RUNNING, false)
        if (isRunning) {
            // Keep running
        } else {
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
        }
        super.onTaskRemoved(rootIntent)
    }

    override fun onDestroy() {
        super.onDestroy()
    }
}
