import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { userRepository } from '../repositories/userRepository';
import { settingsRepository } from '../repositories/settingsRepository';
import { syncService } from './syncService';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const authService = {
  /**
   * Listen to Firebase auth state changes and sync to local SQLite and Firestore
   */
  subscribeToAuth(callback: (user: AuthUser | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };

        // Cache user in local SQLite for offline access
        try {
          await userRepository.upsertUser({
            id: authUser.uid,
            email: authUser.email || '',
            displayName: authUser.displayName,
            photoUrl: authUser.photoURL,
          });
          await settingsRepository.initDefaultSettings(authUser.uid);
        } catch (err) {
          console.error('Error caching user to local SQLite:', err);
        }

        // Sync to Firestore in background
        syncService.syncUserProfile(authUser).catch((e) => {
          console.warn('Background sync user to Firestore error:', e);
        });

        // Trigger background processing of any pending offline operations
        syncService.processPendingQueue(authUser.uid).catch(() => {});

        callback(authUser);
      } else {
        callback(null);
      }
    });
  },

  /**
   * Sign In with Email and Password & sync to Firestore
   */
  async signIn(email: string, pass: string): Promise<AuthUser> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const u = cred.user;
    const authUser: AuthUser = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
    };

    // Cache locally & sync to Firestore
    await userRepository.upsertUser({
      id: authUser.uid,
      email: authUser.email || '',
      displayName: authUser.displayName,
      photoUrl: authUser.photoURL,
    });
    await syncService.syncUserProfile(authUser);
    syncService.processPendingQueue(authUser.uid).catch(() => {});

    return authUser;
  },

  /**
   * Sign Up with Email, Password, and Display Name & store in Firestore
   */
  async signUp(email: string, pass: string, displayName?: string): Promise<AuthUser> {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const u = cred.user;

    if (displayName?.trim()) {
      await updateProfile(u, { displayName: displayName.trim() });
    }

    const authUser: AuthUser = {
      uid: u.uid,
      email: u.email,
      displayName: displayName?.trim() || u.displayName,
      photoURL: u.photoURL,
    };

    // Save to local SQLite
    await userRepository.upsertUser({
      id: authUser.uid,
      email: authUser.email || '',
      displayName: authUser.displayName,
      photoUrl: authUser.photoURL,
    });
    await settingsRepository.initDefaultSettings(authUser.uid);

    // Save user profile and default settings in Firestore
    await syncService.syncUserProfile(authUser, { createdAt: Date.now() });
    await syncService.syncUserSettings(authUser.uid, {
      weight_unit: 'kg',
      distance_unit: 'km',
      auto_start_rest_timer: 1,
      default_rest_seconds: 90,
      show_rpe: 1,
      show_rir: 0,
      theme: 'dark',
      workout_reminders_enabled: 1,
    });

    return authUser;
  },

  /**
   * Send Password Reset Email
   */
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    const u = auth.currentUser;
    if (!u) return null;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
    };
  },
};
