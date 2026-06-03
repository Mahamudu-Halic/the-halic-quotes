import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const collections = await db.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      collections.map((c) => ({
        ...c,
        quotes: JSON.parse(c.quotes),
      }))
    );
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, userId } = body;

    if (!name || !userId) {
      return NextResponse.json({ error: 'Name and User ID are required' }, { status: 400 });
    }

    const collection = await db.collection.create({
      data: {
        name,
        userId,
        quotes: JSON.stringify([]),
      },
    });

    return NextResponse.json({
      ...collection,
      quotes: [],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionId, quoteId, action } = body;

    if (!collectionId || !quoteId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    let quotesList: string[] = JSON.parse(collection.quotes);

    if (action === 'add') {
      if (!quotesList.includes(quoteId)) {
        quotesList.push(quoteId);
      }
    } else if (action === 'remove') {
      quotesList = quotesList.filter((id) => id !== quoteId);
    }

    const updated = await db.collection.update({
      where: { id: collectionId },
      data: {
        quotes: JSON.stringify(quotesList),
      },
    });

    return NextResponse.json({
      ...updated,
      quotes: quotesList,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('id');

    if (!collectionId) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 });
    }

    await db.collection.delete({
      where: { id: collectionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
