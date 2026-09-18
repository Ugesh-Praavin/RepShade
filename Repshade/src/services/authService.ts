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

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const authService = {
  /**
   * Listen to Firebase auth state changes and sync to local SQLite
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

        callback(authUser);
      } else {
        callback(null);
      }
    });
  },

  /**
   * Sign In with Email and Password
   */
  async signIn(email: string, pass: string): Promise<AuthUser> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const u = cred.user;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      photoURL: u.photoURL,
    };
  },

  /**
   * Sign Up with Email, Password, and Display Name
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
