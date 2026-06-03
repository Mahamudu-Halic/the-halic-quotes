import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = ['Success', 'Leadership', 'Faith', 'Productivity', 'Discipline'];
    const dailyQuotes: Record<string, any> = {};

    for (const cat of categories) {
      const quotes = await db.quote.findMany({
        where: { category: cat },
      });

      if (quotes.length > 0) {
        // Use a deterministic index based on the day of the year so the quote changes daily
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const index = dayOfYear % quotes.length;
        dailyQuotes[cat.toLowerCase()] = quotes[index];
      } else {
        // Fallback placeholder if database is empty
        dailyQuotes[cat.toLowerCase()] = {
          id: `fallback-${cat.toLowerCase()}`,
          content: `Believe you can and you're halfway there. Curating daily ${cat} reflections.`,
          author: "TheHalicQuotes",
          category: cat,
          mood: "Motivated",
        };
      }
    }

    return NextResponse.json(dailyQuotes);
  } catch (error) {
    console.error('Error fetching daily quotes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
