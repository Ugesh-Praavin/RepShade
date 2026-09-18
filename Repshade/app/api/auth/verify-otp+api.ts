import { verifyOtpCode } from '../../../server/otpServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.email || !body.code) {
      return Response.json(
        { success: false, error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const result = verifyOtpCode(body.email, body.code);
    return Response.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
