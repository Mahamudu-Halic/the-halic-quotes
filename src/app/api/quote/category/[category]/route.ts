import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const resolvedParams = await params;
    const category = resolvedParams.category;
    
    // Capitalize first letter to match DB format
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

    const quotes = await db.quote.findMany({
      where: {
        category: formattedCategory,
      },
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes by category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
