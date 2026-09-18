import { create } from 'zustand';
import { authService, AuthUser } from '../services/authService';
import { userRepository } from '../repositories/userRepository';

export const GUEST_USER: AuthUser = {
  uid: 'local_user',
  email: 'guest@gmail.com',
  displayName: 'user',
  photoURL: null,
};

export interface AuthStoreState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeAuth: () => () => void;
  continueAsGuest: () => void;
  signIn: (email: string, pass: string) => Promise<AuthUser>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfilePhoto: (photoURL: string | null) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: GUEST_USER,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  continueAsGuest: () => {
    set({
      user: GUEST_USER,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  initializeAuth: () => {
    set({ isInitializing: true });
    // Listen to Firebase Auth state
    const unsubscribe = authService.subscribeToAuth(async (user) => {
      let resolvedUser = user;
      if (!resolvedUser) {
        try {
          const localGuest = await userRepository.getUser('local_user');
          if (localGuest && localGuest.photo_url) {
            resolvedUser = {
              ...GUEST_USER,
              photoURL: localGuest.photo_url,
            };
          } else {
            resolvedUser = GUEST_USER;
          }
        } catch {
          resolvedUser = GUEST_USER;
        }
      }

      set({
        user: resolvedUser,
        isAuthenticated: !!user,
        isInitializing: false,
        isLoading: false,
        error: null,
      });
    });

    return unsubscribe;
  },

  signIn: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signIn(email, pass);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      let message = err?.message || 'Failed to sign in';
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (err?.code === 'auth/user-not-found') {
        message = 'No athlete account found with this email.';
      } else if (err?.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signUp: async (email: string, pass: string, displayName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp(email, pass, displayName);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      let message = err?.message || 'Failed to create account';
      if (err?.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (err?.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: GUEST_USER, isAuthenticated: false, isLoading: false, error: null });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to sign out', isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to send reset email', isLoading: false });
      throw err;
    }
  },

  updateProfilePhoto: async (photoURL: string | null) => {
    try {
      await authService.updateProfilePhoto(photoURL);
      set((state) => ({
        user: state.user ? { ...state.user, photoURL } : null,
      }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update profile avatar' });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
