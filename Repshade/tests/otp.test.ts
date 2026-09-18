import { generateOTP, getEmailHtml, verifyOtpCode, otpStore } from '../server/otpServer';
import { getOtpServerUrl } from '../src/services/otpService';

describe('OTP Verification Service & Server', () => {
  const testEmail = 'athlete.test@repshade.app';

  beforeEach(() => {
    otpStore.clear();
  });

  it('should generate a 6-digit numeric OTP', () => {
    for (let i = 0; i < 20; i++) {
      const code = generateOTP();
      expect(code).toHaveLength(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    }
  });

  it('should format HTML email with Repshade branding and OTP', () => {
    const code = '582914';
    const html = getEmailHtml(code, testEmail);

    expect(html).toContain('REPSHADE');
    expect(html).toContain(code);
    expect(html).toContain(testEmail);
    expect(html).toContain('Verify Your Account');
  });

  it('should reject verification if no code was requested', () => {
    const res = verifyOtpCode('unknown@example.com', '123456');
    expect(res.success).toBe(false);
    expect(res.error).toContain('No verification code');
  });

  it('should reject invalid verification codes and track attempts', () => {
    otpStore.set(testEmail, {
      code: '654321',
      expiresAt: Date.now() + 600000,
      attempts: 0,
      verified: false,
      createdAt: Date.now(),
    });

    const res = verifyOtpCode(testEmail, '111111');
    expect(res.success).toBe(false);
    expect(res.error).toContain('Invalid verification code');

    const record = otpStore.get(testEmail);
    expect(record?.attempts).toBe(1);
  });

  it('should successfully verify when matching code is provided', () => {
    otpStore.set(testEmail, {
      code: '654321',
      expiresAt: Date.now() + 600000,
      attempts: 0,
      verified: false,
      createdAt: Date.now(),
    });

    const res = verifyOtpCode(testEmail, '654321');
    expect(res.success).toBe(true);
    expect(res.message).toContain('Email successfully verified');

    const record = otpStore.get(testEmail);
    expect(record?.verified).toBe(true);
  });

  it('should reject expired verification codes', () => {
    otpStore.set(testEmail, {
      code: '654321',
      expiresAt: Date.now() - 1000, // Expired
      attempts: 0,
      verified: false,
      createdAt: Date.now() - 601000,
    });

    const res = verifyOtpCode(testEmail, '654321');
    expect(res.success).toBe(false);
    expect(res.error).toContain('expired');
  });

  it('should provide correct fallback OTP server URLs for environments', () => {
    const url = getOtpServerUrl();
    expect(url).toBeDefined();
    expect(typeof url).toBe('string');
  });
});
