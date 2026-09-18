import http from 'http';
import nodemailer from 'nodemailer';

const PORT = Number(process.env.PORT || 3000);
const APP_EMAIL = process.env.APP_EMAIL || 'tharunp29112006@gmail.com';
const APP_PASSWORD = process.env.APP_PASSWORD || 'wngscejzioyiwrvu';

export interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  createdAt: number;
}

// In-memory OTP storage keyed by lowercase email
export const otpStore = new Map<string, OtpRecord>();

// Nodemailer transport using Gmail SMTP and App Password
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getEmailHtml(otp: string, recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Repshade Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0B0D0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0D0F; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="500" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #15181C; border-radius: 16px; border: 1px solid #24292F; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #24292F;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #00E676;">REPSHADE</h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #8B949E; text-transform: uppercase;">Train • Log • Progress • Repeat</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">Verify Your Account</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #8B949E;">
                Thank you for joining Repshade. Enter the 6-digit verification code below in the app to complete your authentication.
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #0B0D0F; border: 2px solid #00E676; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #00E676; text-shadow: 0 0 12px rgba(0, 230, 118, 0.4);">${otp}</span>
              </div>
              
              <p style="margin: 24px 0 0 0; font-size: 13px; color: #6E7681; line-height: 1.5;">
                ⏰ <strong>This code will expire in 10 minutes.</strong><br/>
                If you did not request this verification code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F1215; padding: 20px 32px; text-align: center; border-top: 1px solid #24292F;">
              <p style="margin: 0; font-size: 12px; color: #484F58;">
                Sent to <span style="color: #8B949E;">${recipientEmail}</span> by Repshade Authentication
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendOtpEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const code = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, {
    code,
    expiresAt,
    attempts: 0,
    verified: false,
    createdAt: Date.now(),
  });

  try {
    await transporter.sendMail({
      from: `"Repshade Verification" <${APP_EMAIL}>`,
      to: cleanEmail,
      subject: `Your Repshade Verification Code: ${code}`,
      text: `Your Repshade verification code is: ${code}\n\nThis code will expire in 10 minutes. If you did not request this code, you can ignore this email.`,
      html: getEmailHtml(code, cleanEmail),
    });

    console.log(`[OTP Server] Successfully sent OTP code to ${cleanEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[OTP Server] Failed to send email to ${cleanEmail}:`, err.message);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

export function verifyOtpCode(email: string, code: string): { success: boolean; message?: string; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return { success: false, error: 'No verification code was requested for this email.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return { success: false, error: 'Verification code has expired. Please request a new one.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(cleanEmail);
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  if (record.code !== code.trim()) {
    record.attempts += 1;
    return { success: false, error: 'Invalid verification code. Please check and try again.' };
  }

  record.verified = true;
  return { success: true, message: 'Email successfully verified!' };
}

// HTTP Server handling REST requests
export function createOtpServer() {
  return http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Enable CORS for mobile app & web requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url || '/';

    // Health check endpoint
    if (req.method === 'GET' && (url === '/' || url === '/health')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'Repshade OTP Server', emailSender: APP_EMAIL }));
      return;
    }

    // Parse JSON body helper
    const readBody = (): Promise<any> =>
      new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk: any) => (data += chunk));
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve({});
          }
        });
      });

    // POST /api/auth/send-otp
    if (req.method === 'POST' && url.includes('/send-otp')) {
      const body = await readBody();
      if (!body.email || typeof body.email !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'A valid email address is required.' }));
        return;
      }

      const result = await sendOtpEmail(body.email);
      res.writeHead(result.success ? 200 : 500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // POST /api/auth/verify-otp
    if (req.method === 'POST' && url.includes('/verify-otp')) {
      const body = await readBody();
      if (!body.email || !body.code) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Email and verification code are required.' }));
        return;
      }

      const result = verifyOtpCode(body.email, body.code);
      res.writeHead(result.success ? 200 : 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  });
}

// Start server if executed directly
if (typeof require !== 'undefined' && (require as any).main === module) {
  const server = createOtpServer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Repshade OTP Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Repshade OTP Server] Connected to Gmail SMTP (${APP_EMAIL})`);
  });
}
