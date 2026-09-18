import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, SCHEMA_V1 } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Global transaction queue lock to prevent concurrent "BEGIN TRANSACTION" on the same SQLite connection
let transactionQueue: Promise<any> = Promise.resolve();

/**
 * Get or initialize the SQLite database connection (thread-safe singleton promise)
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await initDatabase(db);
    dbInstance = db;
    return db;
  })();

  return initPromise;
}

/**
 * Initialize schema tables and indexes
 */
export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  // Enable foreign keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Run schema creation
  await db.execAsync(SCHEMA_V1);
}

/**
 * Sanitize query parameters converting undefined/boolean to SQLite-friendly values
 */
export function sanitizeParams(
  params: any[] = []
): SQLite.SQLiteBindValue[] {
  const list = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
  return list.map((p) => {
    if (p === undefined || p === null) return null;
    if (typeof p === 'boolean') return p ? 1 : 0;
    return p;
  }) as SQLite.SQLiteBindValue[];
}

export interface TransactionExecutor {
  execute: (
    sql: string,
    params?: (string | number | boolean | null | undefined)[]
  ) => Promise<SQLite.SQLiteRunResult>;
  queryAll: <T>(
    sql: string,
    params?: (string | number | boolean | null | undefined)[]
  ) => Promise<T[]>;
  queryFirst: <T>(
    sql: string,
    params?: (string | number | boolean | null | undefined)[]
  ) => Promise<T | null>;
  runAsync: (sql: string, ...params: any[]) => Promise<SQLite.SQLiteRunResult>;
  db: SQLite.SQLiteDatabase;
}

/**
 * Helper to run queries within an isolated transaction.
 * Uses a promise queue to serialize transaction blocks and prevent nested BEGIN TRANSACTION conflicts.
 */
export async function withTransaction<T>(
  callback: (tx: TransactionExecutor) => Promise<T>
): Promise<T> {
  const execution = transactionQueue.then(async () => {
    const db = await getDatabase();
    let result: T;
    await db.withTransactionAsync(async () => {
      const tx: TransactionExecutor = {
        execute: async (sql, params = []) => {
          const safe = sanitizeParams(params);
          return await db.runAsync(sql, ...safe);
        },
        queryAll: async <R>(sql: string, params: any[] = []) => {
          const safe = sanitizeParams(params);
          return await db.getAllAsync<R>(sql, ...safe);
        },
        queryFirst: async <R>(sql: string, params: any[] = []) => {
          const safe = sanitizeParams(params);
          return await db.getFirstAsync<R>(sql, ...safe);
        },
        runAsync: async (sql: string, ...params: any[]) => {
          const safe = sanitizeParams(params);
          return await db.runAsync(sql, ...safe);
        },
        db,
      };
      result = await callback(tx);
    });
    return result!;
  });

  // Ensure queue keeps flowing even if a transaction fails
  transactionQueue = execution.catch(() => {});

  return execution;
}

/**
 * Execute parameterized read query returning typed rows
 */
export async function queryAll<T>(
  sql: string,
  params: (string | number | boolean | null | undefined)[] = []
): Promise<T[]> {
  const db = await getDatabase();
  const safe = sanitizeParams(params);
  return await db.getAllAsync<T>(sql, ...safe);
}

/**
 * Execute parameterized read query returning a single typed row
 */
export async function queryFirst<T>(
  sql: string,
  params: (string | number | boolean | null | undefined)[] = []
): Promise<T | null> {
  const db = await getDatabase();
  const safe = sanitizeParams(params);
  return await db.getFirstAsync<T>(sql, ...safe);
}

/**
 * Execute parameterized write statement (INSERT, UPDATE, DELETE)
 */
export async function execute(
  sql: string,
  params: (string | number | boolean | null | undefined)[] = []
): Promise<SQLite.SQLiteRunResult> {
  const db = await getDatabase();
  const safe = sanitizeParams(params);
  return await db.runAsync(sql, ...safe);
}

/**
 * Truncates all SQLite tables and re-initializes schema
 */
export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA foreign_keys = OFF;
    DROP TABLE IF EXISTS workout_sets;
    DROP TABLE IF EXISTS workout_sessions;
    DROP TABLE IF EXISTS personal_records;
    DROP TABLE IF EXISTS body_weight_entries;
    DROP TABLE IF EXISTS workout_exercises;
    DROP TABLE IF EXISTS workout_templates;
    DROP TABLE IF EXISTS splits;
    DROP TABLE IF EXISTS sync_operations;
    DROP TABLE IF EXISTS exercises;
    PRAGMA foreign_keys = ON;
  `);
  await initDatabase(db);
}
