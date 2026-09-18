import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { execute } from '../database/client';

export interface OtpResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export function getOtpServerUrl(): string {
  if (process.env.EXPO_PUBLIC_OTP_SERVER_URL) {
    return process.env.EXPO_PUBLIC_OTP_SERVER_URL;
  }
  if (Platform.OS === 'android') {
    // In Android emulator, 10.0.2.2 maps to host localhost
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
}

export const otpService = {
  /**
   * Request a 6-digit OTP to be sent to the user's email address
   */
  async sendOtp(email: string): Promise<OtpResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const serverUrl = getOtpServerUrl();

    try {
      const response = await fetch(`${serverUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Failed to send verification code. Please try again.',
        };
      }

      return {
        success: true,
        message: 'A 6-digit verification code has been sent to your email.',
      };
    } catch (err: any) {
      console.warn('Network error while connecting to OTP server:', err.message);
      return {
        success: false,
        error: 'Unable to reach the verification service. Please make sure the server is running.',
      };
    }
  },

  /**
   * Verify the 6-digit OTP entered by the user
   */
  async verifyOtp(email: string, code: string, userId?: string): Promise<OtpResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const serverUrl = getOtpServerUrl();

    try {
      const response = await fetch(`${serverUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode, userId }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Invalid verification code. Please check and try again.',
        };
      }

      // Mark verified in local SQLite if userId is available
      if (userId) {
        try {
          await execute(
            `UPDATE users SET updated_at = ? WHERE id = ?;`,
            [Date.now(), userId]
          );
        } catch (e) {
          console.warn('Could not update user verified status in SQLite:', e);
        }

        // Mark verified in Firestore user document
        if (firestore) {
          try {
            const userRef = doc(firestore, 'users', userId);
            await setDoc(userRef, { emailVerified: true, verifiedAt: Date.now() }, { merge: true });
          } catch (e) {
            console.warn('Could not update user verified status in Firestore:', e);
          }
        }
      }

      return {
        success: true,
        message: 'Email successfully verified!',
      };
    } catch (err: any) {
      console.warn('Network error while verifying OTP:', err.message);
      return {
        success: false,
        error: 'Unable to verify code due to a network connection error.',
      };
    }
  },
};
