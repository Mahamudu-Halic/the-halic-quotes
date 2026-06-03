import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let progress = await db.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      // Create new record
      progress = await db.userProgress.create({
        data: {
          userId,
          streakCount: 1,
          lastActive: new Date(),
          interests: JSON.stringify(['Success']),
          unlockedBadges: JSON.stringify(['Day 1 Activator']),
        },
      });
    }

    return NextResponse.json({
      ...progress,
      interests: JSON.parse(progress.interests),
      unlockedBadges: JSON.parse(progress.unlockedBadges),
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, interests, badgeName } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let progress = await db.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      progress = await db.userProgress.create({
        data: {
          userId,
          streakCount: 1,
          lastActive: new Date(),
          interests: JSON.stringify(interests || ['Success']),
          unlockedBadges: JSON.stringify(['Day 1 Activator']),
        },
      });
    }

    const currentInterests = JSON.parse(progress.interests);
    const currentBadges = JSON.parse(progress.unlockedBadges);

    if (action === 'check_streak') {
      const lastActive = new Date(progress.lastActive);
      const today = new Date();
      const differenceInTime = today.getTime() - lastActive.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      let newStreak = progress.streakCount;
      if (differenceInDays >= 1 && differenceInDays < 2) {
        // Daily login, increment streak!
        newStreak += 1;
      } else if (differenceInDays >= 2) {
        // Streak broken
        newStreak = 1;
      }

      // Check badges to unlock based on streak
      const badgesToUnlock = [...currentBadges];
      if (newStreak >= 7 && !badgesToUnlock.includes('7 Day Streak')) {
        badgesToUnlock.push('7 Day Streak');
      }
      if (newStreak >= 30 && !badgesToUnlock.includes('30 Day Streak')) {
        badgesToUnlock.push('30 Day Streak');
      }

      progress = await db.userProgress.update({
        where: { userId },
        data: {
          streakCount: newStreak,
          lastActive: today,
          unlockedBadges: JSON.stringify(badgesToUnlock),
        },
      });
    } else if (action === 'update_interests' && interests) {
      progress = await db.userProgress.update({
        where: { userId },
        data: {
          interests: JSON.stringify(interests),
        },
      });
    } else if (action === 'unlock_badge' && badgeName) {
      if (!currentBadges.includes(badgeName)) {
        currentBadges.push(badgeName);
        progress = await db.userProgress.update({
          where: { userId },
          data: {
            unlockedBadges: JSON.stringify(currentBadges),
          },
        });
      }
    }

    return NextResponse.json({
      ...progress,
      interests: JSON.parse(progress.interests),
      unlockedBadges: JSON.parse(progress.unlockedBadges),
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
