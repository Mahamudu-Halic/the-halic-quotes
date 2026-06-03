import { NextRequest, NextResponse } from 'next/server';
import { generateAIQuote, rewriteQuote, explainQuote } from '@/lib/ai';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, topic, mood, goal, audience, quote, style, userId } = body;

    if (action === 'generate') {
      if (!topic || !mood || !goal || !audience) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
      }
      
      const content = await generateAIQuote(topic, mood, goal, audience);
      
      // Auto-save generated quote to the database for this specific user or as system quote
      const savedQuote = await db.quote.create({
        data: {
          content,
          author: 'AI Generator',
          category: topic,
          mood,
          tags: `${goal.toLowerCase()}, ${audience.toLowerCase()}`,
        },
      });

      return NextResponse.json({ quote: savedQuote });
    }

    if (action === 'rewrite') {
      if (!quote || !style) {
        return NextResponse.json({ error: 'Missing quote or style parameter' }, { status: 400 });
      }
      const rewritten = await rewriteQuote(quote, style);
      return NextResponse.json({ rewritten });
    }

    if (action === 'explain') {
      if (!quote) {
        return NextResponse.json({ error: 'Missing quote parameter' }, { status: 400 });
      }
      const explanation = await explainQuote(quote);
      return NextResponse.json(explanation);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in generate-quote API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
