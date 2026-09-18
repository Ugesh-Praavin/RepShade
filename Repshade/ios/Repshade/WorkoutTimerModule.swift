import Foundation
import UserNotifications
import React

@objc(WorkoutTimerModule)
class WorkoutTimerModule: RCTEventEmitter {
  public static var shared: WorkoutTimerModule?

  public static let NOTIFICATION_ID = "repshade_active_workout"
  public static let SUMMARY_NOTIFICATION_ID = "repshade_completed_workout"
  public static let CATEGORY_ID = "WORKOUT_TIMER_CATEGORY"
  public static let STOP_ACTION_ID = "STOP_WORKOUT_ACTION"

  private static let PREF_IS_RUNNING = "repshade_is_running"
  private static let PREF_IS_PAUSED = "repshade_is_paused"
  private static let PREF_SESSION_ID = "repshade_session_id"
  private static let PREF_WORKOUT_NAME = "repshade_workout_name"
  private static let PREF_STARTED_AT = "repshade_started_at"
  private static let PREF_PAUSED_AT = "repshade_paused_at"
  private static let PREF_TOTAL_PAUSED_MS = "repshade_total_paused_ms"
  private static let PREF_HAS_PENDING_COMPLETION = "repshade_has_pending_completion"
  private static let PREF_COMPLETED_DURATION = "repshade_completed_duration"
  private static let PREF_COMPLETED_AT = "repshade_completed_at"
  private static let PREF_COMPLETED_SESSION_ID = "repshade_completed_session_id"

  private var hasListeners = false

  override init() {
    super.init()
    WorkoutTimerModule.shared = self
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc override func supportedEvents() -> [String] {
    return ["onWorkoutTimerStopped"]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  public static func formatDuration(_ seconds: Int) -> String {
    let mins = seconds / 60
    let secs = seconds % 60
    let hrs = mins / 60
    if hrs > 0 {
      let remMins = mins % 60
      return String(format: "%d:%02d:%02d", hrs, remMins, secs)
    } else {
      return String(format: "%02d:%02d", mins, secs)
    }
  }

  public static func registerNotificationCategory() {
    let stopAction = UNNotificationAction(
      identifier: STOP_ACTION_ID,
      title: "Stop Timer",
      options: [.foreground]
    )

    let category = UNNotificationCategory(
      identifier: CATEGORY_ID,
      actions: [stopAction],
      intentIdentifiers: [],
      options: [.customDismissAction]
    )

    UNUserNotificationCenter.current().setNotificationCategories([category])
  }

  @objc(requestNotificationPermission:rejecter:)
  func requestNotificationPermission(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      if let error = error {
        reject("PERMISSION_ERROR", error.localizedDescription, error)
      } else {
        WorkoutTimerModule.registerNotificationCategory()
        resolve(granted)
      }
    }
  }

  @objc(startTimer:workoutName:startedAtMs:resolver:rejecter:)
  func startTimer(
    _ sessionId: String,
    workoutName: String,
    startedAtMs: Double,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    WorkoutTimerModule.registerNotificationCategory()

    let defaults = UserDefaults.standard
    defaults.set(true, forKey: WorkoutTimerModule.PREF_IS_RUNNING)
    defaults.set(false, forKey: WorkoutTimerModule.PREF_IS_PAUSED)
    defaults.set(sessionId, forKey: WorkoutTimerModule.PREF_SESSION_ID)
    defaults.set(workoutName, forKey: WorkoutTimerModule.PREF_WORKOUT_NAME)
    defaults.set(startedAtMs, forKey: WorkoutTimerModule.PREF_STARTED_AT)
    defaults.set(0.0, forKey: WorkoutTimerModule.PREF_PAUSED_AT)
    defaults.set(0.0, forKey: WorkoutTimerModule.PREF_TOTAL_PAUSED_MS)
    defaults.set(false, forKey: WorkoutTimerModule.PREF_HAS_PENDING_COMPLETION)

    // Schedule active workout notification with Stop Timer button
    let content = UNMutableNotificationContent()
    content.title = "Workout in Progress 🏋️"
    content.subtitle = workoutName
    content.body = "Timer running • Tap 'Stop Timer' below to finish session"
    content.categoryIdentifier = WorkoutTimerModule.CATEGORY_ID
    content.sound = nil

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(
      identifier: WorkoutTimerModule.NOTIFICATION_ID,
      content: content,
      trigger: trigger
    )

    UNUserNotificationCenter.current().add(request) { error in
      if let error = error {
        reject("NOTIFICATION_ERROR", error.localizedDescription, error)
      } else {
        resolve(true)
      }
    }
  }

  @objc(pauseTimer:resolver:rejecter:)
  func pauseTimer(
    _ elapsedSeconds: Int,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let defaults = UserDefaults.standard
    let now = Date().timeIntervalSince1970 * 1000
    defaults.set(true, forKey: WorkoutTimerModule.PREF_IS_PAUSED)
    defaults.set(now, forKey: WorkoutTimerModule.PREF_PAUSED_AT)

    let workoutName = defaults.string(forKey: WorkoutTimerModule.PREF_WORKOUT_NAME) ?? "Workout"
    let formatted = WorkoutTimerModule.formatDuration(elapsedSeconds)

    let content = UNMutableNotificationContent()
    content.title = "Workout Paused ⏸️"
    content.subtitle = workoutName
    content.body = "Paused at \(formatted) • Tap to resume training"
    content.categoryIdentifier = WorkoutTimerModule.CATEGORY_ID
    content.sound = nil

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(
      identifier: WorkoutTimerModule.NOTIFICATION_ID,
      content: content,
      trigger: trigger
    )

    UNUserNotificationCenter.current().add(request) { error in
      if let error = error {
        reject("NOTIFICATION_ERROR", error.localizedDescription, error)
      } else {
        resolve(true)
      }
    }
  }

  @objc(resumeTimer:rejecter:)
  func resumeTimer(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let defaults = UserDefaults.standard
    let now = Date().timeIntervalSince1970 * 1000
    let pausedAt = defaults.double(forKey: WorkoutTimerModule.PREF_PAUSED_AT)
    var totalPaused = defaults.double(forKey: WorkoutTimerModule.PREF_TOTAL_PAUSED_MS)
    if pausedAt > 0 {
      totalPaused += (now - pausedAt)
    }

    defaults.set(false, forKey: WorkoutTimerModule.PREF_IS_PAUSED)
    defaults.set(0.0, forKey: WorkoutTimerModule.PREF_PAUSED_AT)
    defaults.set(totalPaused, forKey: WorkoutTimerModule.PREF_TOTAL_PAUSED_MS)

    let workoutName = defaults.string(forKey: WorkoutTimerModule.PREF_WORKOUT_NAME) ?? "Workout"

    let content = UNMutableNotificationContent()
    content.title = "Workout in Progress 🏋️"
    content.subtitle = workoutName
    content.body = "Timer running • Tap 'Stop Timer' below to finish session"
    content.categoryIdentifier = WorkoutTimerModule.CATEGORY_ID
    content.sound = nil

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(
      identifier: WorkoutTimerModule.NOTIFICATION_ID,
      content: content,
      trigger: trigger
    )

    UNUserNotificationCenter.current().add(request) { error in
      if let error = error {
        reject("NOTIFICATION_ERROR", error.localizedDescription, error)
      } else {
        resolve(true)
      }
    }
  }

  @objc(stopTimer:rejecter:)
  func stopTimer(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let defaults = UserDefaults.standard
    defaults.set(false, forKey: WorkoutTimerModule.PREF_IS_RUNNING)
    defaults.set(false, forKey: WorkoutTimerModule.PREF_IS_PAUSED)

    UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [WorkoutTimerModule.NOTIFICATION_ID])
    UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [WorkoutTimerModule.NOTIFICATION_ID])

    resolve(true)
  }

  @objc(getTimerStatus:rejecter:)
  func getTimerStatus(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let defaults = UserDefaults.standard
    let isRunning = defaults.bool(forKey: WorkoutTimerModule.PREF_IS_RUNNING)
    let isPaused = defaults.bool(forKey: WorkoutTimerModule.PREF_IS_PAUSED)
    let sessionId = defaults.string(forKey: WorkoutTimerModule.PREF_SESSION_ID)
    let workoutName = defaults.string(forKey: WorkoutTimerModule.PREF_WORKOUT_NAME)
    let startedAt = defaults.double(forKey: WorkoutTimerModule.PREF_STARTED_AT)

    let now = Date().timeIntervalSince1970 * 1000
    let totalPaused = defaults.double(forKey: WorkoutTimerModule.PREF_TOTAL_PAUSED_MS)
    let pausedAt = defaults.double(forKey: WorkoutTimerModule.PREF_PAUSED_AT)
    let effectivePaused = totalPaused + (isPaused && pausedAt > 0 ? (now - pausedAt) : 0)
    let elapsed = isRunning ? max(0, Int((now - startedAt - effectivePaused) / 1000)) : 0

    let result: [String: Any?] = [
      "isRunning": isRunning,
      "isPaused": isPaused,
      "sessionId": sessionId,
      "workoutName": workoutName,
      "startedAt": startedAt,
      "elapsedSeconds": elapsed
    ]

    resolve(result)
  }

  @objc(getPendingCompletedWorkout:rejecter:)
  func getPendingCompletedWorkout(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let defaults = UserDefaults.standard
    let hasPending = defaults.bool(forKey: WorkoutTimerModule.PREF_HAS_PENDING_COMPLETION)
    let sessionId = defaults.string(forKey: WorkoutTimerModule.PREF_COMPLETED_SESSION_ID)
    let durationSeconds = defaults.integer(forKey: WorkoutTimerModule.PREF_COMPLETED_DURATION)
    let completedAt = defaults.double(forKey: WorkoutTimerModule.PREF_COMPLETED_AT)

    let result: [String: Any?] = [
      "hasPending": hasPending,
      "sessionId": sessionId,
      "durationSeconds": durationSeconds,
      "completedAt": completedAt
    ]

    resolve(result)
  }

  @objc(clearPendingCompletedWorkout:rejecter:)
  func clearPendingCompletedWorkout(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    let defaults = UserDefaults.standard
    defaults.set(false, forKey: WorkoutTimerModule.PREF_HAS_PENDING_COMPLETION)
    defaults.removeObject(forKey: WorkoutTimerModule.PREF_COMPLETED_DURATION)
    defaults.removeObject(forKey: WorkoutTimerModule.PREF_COMPLETED_SESSION_ID)
    defaults.removeObject(forKey: WorkoutTimerModule.PREF_COMPLETED_AT)
    resolve(true)
  }

  public static func handleStopAction() {
    let defaults = UserDefaults.standard
    let sessionId = defaults.string(forKey: PREF_SESSION_ID) ?? ""
    let workoutName = defaults.string(forKey: PREF_WORKOUT_NAME) ?? "Workout"
    let startedAt = defaults.double(forKey: PREF_STARTED_AT)
    let totalPausedMs = defaults.double(forKey: PREF_TOTAL_PAUSED_MS)
    let isPaused = defaults.bool(forKey: PREF_IS_PAUSED)
    let pausedAt = defaults.double(forKey: PREF_PAUSED_AT)

    let now = Date().timeIntervalSince1970 * 1000
    let effectivePaused = totalPausedMs + (isPaused && pausedAt > 0 ? (now - pausedAt) : 0)
    let elapsedMs = max(0, now - startedAt - effectivePaused)
    let durationSeconds = Int(elapsedMs / 1000)

    defaults.set(false, forKey: PREF_IS_RUNNING)
    defaults.set(false, forKey: PREF_IS_PAUSED)
    defaults.set(true, forKey: PREF_HAS_PENDING_COMPLETION)
    defaults.set(durationSeconds, forKey: PREF_COMPLETED_DURATION)
    defaults.set(sessionId, forKey: PREF_COMPLETED_SESSION_ID)
    defaults.set(now, forKey: PREF_COMPLETED_AT)

    // Remove active notification
    UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [NOTIFICATION_ID])
    UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [NOTIFICATION_ID])

    // Post completed summary notification
    let formatted = formatDuration(durationSeconds)
    let content = UNMutableNotificationContent()
    content.title = "Workout Completed! 🎉"
    content.subtitle = workoutName
    content.body = "Duration: \(formatted) • Tap to view summary"
    content.sound = UNNotificationSound.default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(
      identifier: SUMMARY_NOTIFICATION_ID,
      content: content,
      trigger: trigger
    )
    UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)

    // Notify React Native if active
    if let module = shared, module.hasListeners {
      module.sendEvent(withName: "onWorkoutTimerStopped", body: [
        "sessionId": sessionId,
        "durationSeconds": durationSeconds,
        "stoppedAt": now
      ])
    }
  }
}
