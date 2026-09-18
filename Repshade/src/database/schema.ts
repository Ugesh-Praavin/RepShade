// Repshade SQLite Schema & Migrations

export const DATABASE_NAME = 'repshade.db';
export const CURRENT_SCHEMA_VERSION = 1;

export const SCHEMA_V1 = `
-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT,
    photo_url TEXT,
    active_split_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 2. User Settings table
CREATE TABLE IF NOT EXISTS settings (
    user_id TEXT PRIMARY KEY,
    weight_unit TEXT NOT NULL DEFAULT 'kg',
    distance_unit TEXT NOT NULL DEFAULT 'km',
    auto_start_rest_timer INTEGER NOT NULL DEFAULT 1,
    default_rest_seconds INTEGER NOT NULL DEFAULT 90,
    show_rpe INTEGER NOT NULL DEFAULT 1,
    show_rir INTEGER NOT NULL DEFAULT 0,
    theme TEXT NOT NULL DEFAULT 'dark',
    workout_reminders_enabled INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 3. Splits table (Rolling Split state)
CREATE TABLE IF NOT EXISTS splits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    current_workout_index INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 4. Workout Templates table (What I planned to do)
CREATE TABLE IF NOT EXISTS workout_templates (
    id TEXT PRIMARY KEY,
    split_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    workout_order INTEGER NOT NULL,
    estimated_duration_minutes INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (split_id) REFERENCES splits(id) ON DELETE CASCADE
);

-- 5. Exercises library table
CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    primary_muscle TEXT NOT NULL,
    secondary_muscles TEXT,
    equipment TEXT,
    tracking_type TEXT NOT NULL DEFAULT 'weight_reps',
    is_custom INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 6. Workout Template Exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
    id TEXT PRIMARY KEY,
    workout_template_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    exercise_order INTEGER NOT NULL,
    target_sets INTEGER NOT NULL DEFAULT 3,
    target_rep_min INTEGER DEFAULT 8,
    target_rep_max INTEGER DEFAULT 12,
    rest_seconds INTEGER DEFAULT 90,
    set_type TEXT NOT NULL DEFAULT 'normal',
    notes TEXT,
    is_superset INTEGER NOT NULL DEFAULT 0,
    superset_group TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- 7. Workout Sessions table (What I actually did - Historical immutable)
CREATE TABLE IF NOT EXISTS workout_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    split_id TEXT NOT NULL,
    workout_template_id TEXT NOT NULL,
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    status TEXT NOT NULL DEFAULT 'in_progress',
    duration_seconds INTEGER DEFAULT 0,
    total_volume REAL DEFAULT 0,
    total_sets INTEGER DEFAULT 0,
    total_reps INTEGER DEFAULT 0,
    notes TEXT,
    split_advanced INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 8. Workout Sets table
CREATE TABLE IF NOT EXISTS workout_sets (
    id TEXT PRIMARY KEY,
    workout_session_id TEXT NOT NULL,
    workout_exercise_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL,
    reps INTEGER,
    duration_seconds INTEGER,
    distance REAL,
    rpe REAL,
    rir REAL,
    set_type TEXT NOT NULL DEFAULT 'normal',
    completed INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
);

-- 9. Personal Records table
CREATE TABLE IF NOT EXISTS personal_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    exercise_id TEXT NOT NULL,
    record_type TEXT NOT NULL,
    value REAL NOT NULL,
    weight REAL,
    reps INTEGER,
    workout_session_id TEXT NOT NULL,
    achieved_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 10. Body Weight Entries table
CREATE TABLE IF NOT EXISTS body_weight_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    weight REAL NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    recorded_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 11. Offline Sync Queue table
CREATE TABLE IF NOT EXISTS sync_operations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    operation TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_attempt_at INTEGER,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Performance & Query Indexes
CREATE INDEX IF NOT EXISTS idx_splits_user ON splits(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_split ON workout_templates(split_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_template ON workout_exercises(workout_template_id);
CREATE INDEX IF NOT EXISTS idx_exercises_user ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON workout_sets(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise ON workout_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise ON personal_records(exercise_id);
CREATE INDEX IF NOT EXISTS idx_sync_operations_status ON sync_operations(status);
`;
