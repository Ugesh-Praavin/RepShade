import { sendOtpEmail } from '../../../server/otpServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.email || typeof body.email !== 'string') {
      return Response.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const result = await sendOtpEmail(body.email);
    return Response.json(result, { status: result.success ? 200 : 500 });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
