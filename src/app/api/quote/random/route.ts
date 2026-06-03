import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await db.quote.count();
    if (count === 0) {
      return NextResponse.json({ error: 'No quotes found' }, { status: 404 });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuote = await db.quote.findFirst({
      skip: randomIndex,
      include: {
        comments: true,
      }
    });

    return NextResponse.json(randomQuote);
  } catch (error) {
    console.error('Error fetching random quote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
