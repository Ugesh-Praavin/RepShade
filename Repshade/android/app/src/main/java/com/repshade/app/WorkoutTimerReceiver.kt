package com.repshade.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class WorkoutTimerReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            WorkoutTimerService.ACTION_STOP_FROM_NOTIFICATION -> {
                WorkoutTimerService.stopWorkoutFromNotification(context)
            }
            WorkoutTimerService.ACTION_PAUSE_FROM_NOTIFICATION -> {
                val serviceIntent = Intent(context, WorkoutTimerService::class.java).apply {
                    action = WorkoutTimerService.ACTION_PAUSE
                }
                context.startService(serviceIntent)
            }
            WorkoutTimerService.ACTION_RESUME_FROM_NOTIFICATION -> {
                val serviceIntent = Intent(context, WorkoutTimerService::class.java).apply {
                    action = WorkoutTimerService.ACTION_RESUME
                }
                context.startService(serviceIntent)
            }
        }
    }
}
