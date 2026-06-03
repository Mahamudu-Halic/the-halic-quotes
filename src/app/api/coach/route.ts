import { NextRequest, NextResponse } from 'next/server';
import { getMotivationCoachResponse } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Missing message content' }, { status: 400 });
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: msg.content || msg.text || '' }]
    }));

    const response = await getMotivationCoachResponse(message, formattedHistory);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in coach API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
