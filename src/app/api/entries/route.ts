import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for entry creation
const createEntrySchema = z.object({
  date: z.string().datetime(),
  exercise: z.string().min(1),
  content: z.string().min(1),
  userId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createEntrySchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validatedData.error.issues 
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.data.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create entry
    const entry = await prisma.entry.create({
      data: {
        date: new Date(validatedData.data.date),
        exercise: validatedData.data.exercise,
        content: validatedData.data.content,
        userId: validatedData.data.userId,
      },
    });

    return NextResponse.json({ data: entry });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    if (!z.string().uuid().safeParse(userId).success) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get entries
    const entries = await prisma.entry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        exercise: true,
        content: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 