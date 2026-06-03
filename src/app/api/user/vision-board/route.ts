import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let board = await db.visionBoard.findUnique({
      where: { userId },
    });

    if (!board) {
      // Create empty vision board
      board = await db.visionBoard.create({
        data: {
          userId,
          title: 'My 2027 Goals',
          goals: JSON.stringify([
            { id: 'g1', text: 'Become Senior Developer', x: 100, y: 150, checked: false },
            { id: 'g2', text: 'Build SaaS Product', x: 150, y: 280, checked: false },
            { id: 'g3', text: 'Buy House', x: 450, y: 200, checked: false },
          ]),
          quotes: JSON.stringify([
            { id: 'q1', text: 'Success is built one disciplined decision at a time.', x: 300, y: 80 },
          ]),
        },
      });
    }

    return NextResponse.json({
      ...board,
      goals: JSON.parse(board.goals),
      quotes: JSON.parse(board.quotes),
    });
  } catch (error) {
    console.error('Error fetching vision board:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, goals, quotes, backgroundImage } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const board = await db.visionBoard.upsert({
      where: { userId },
      update: {
        title: title || undefined,
        goals: goals ? JSON.stringify(goals) : undefined,
        quotes: quotes ? JSON.stringify(quotes) : undefined,
        backgroundImage: backgroundImage !== undefined ? backgroundImage : undefined,
      },
      create: {
        userId,
        title: title || 'My Vision Board',
        goals: JSON.stringify(goals || []),
        quotes: JSON.stringify(quotes || []),
        backgroundImage: backgroundImage || null,
      },
    });

    return NextResponse.json({
      ...board,
      goals: JSON.parse(board.goals),
      quotes: JSON.parse(board.quotes),
    });
  } catch (error) {
    console.error('Error saving vision board:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
