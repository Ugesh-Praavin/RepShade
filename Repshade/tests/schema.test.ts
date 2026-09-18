import { SCHEMA_V1, DATABASE_NAME } from '../src/database/schema';
import { generateUUID } from '../src/utils/uuid';

describe('Repshade Database Schema & Architecture', () => {
  it('should have the correct database name', () => {
    expect(DATABASE_NAME).toBe('repshade.db');
  });

  it('should include all 11 core SQLite tables in schema definition', () => {
    const requiredTables = [
      'users',
      'settings',
      'splits',
      'workout_templates',
      'workout_exercises',
      'exercises',
      'workout_sessions',
      'workout_sets',
      'personal_records',
      'body_weight_entries',
      'sync_operations',
    ];

    for (const table of requiredTables) {
      expect(SCHEMA_V1).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
  });

  it('should create all required performance indexes', () => {
    const requiredIndexes = [
      'idx_splits_user',
      'idx_workout_templates_split',
      'idx_workout_exercises_template',
      'idx_exercises_user',
      'idx_workout_sessions_user',
      'idx_workout_sessions_date',
      'idx_workout_sets_session',
      'idx_workout_sets_exercise',
      'idx_personal_records_exercise',
      'idx_sync_operations_status',
    ];

    for (const idx of requiredIndexes) {
      expect(SCHEMA_V1).toContain(`CREATE INDEX IF NOT EXISTS ${idx}`);
    }
  });

  it('should generate valid RFC4122 v4 UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    expect(uuid1).toBeDefined();
    expect(uuid2).toBeDefined();
    expect(uuid1).not.toEqual(uuid2);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid1).toMatch(uuidRegex);
    expect(uuid2).toMatch(uuidRegex);
  });
});
