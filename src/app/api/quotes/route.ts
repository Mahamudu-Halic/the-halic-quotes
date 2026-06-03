import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const mood = searchParams.get('mood');
    const author = searchParams.get('author');
    const isPopular = searchParams.get('isPopular') === 'true';
    const isTrending = searchParams.get('isTrending') === 'true';
    const query = searchParams.get('q');

    const whereClause: any = {};

    if (category) whereClause.category = category;
    if (mood) whereClause.mood = mood;
    if (author) whereClause.author = { contains: author };
    if (isPopular) whereClause.isPopular = true;
    if (isTrending) whereClause.isTrending = true;
    if (query) {
      whereClause.OR = [
        { content: { contains: query } },
        { author: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    const quotes = await db.quote.findMany({
      where: whereClause,
      include: {
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, author, category, mood, tags } = body;

    if (!content || !author || !category) {
      return NextResponse.json({ error: 'Content, author, and category are required' }, { status: 400 });
    }

    const newQuote = await db.quote.create({
      data: {
        content,
        author,
        category,
        mood,
        tags,
      },
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    console.error('Error creating user quote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
