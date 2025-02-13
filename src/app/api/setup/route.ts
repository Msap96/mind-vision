import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    // Create a temporary user if it doesn't exist
    const tempUser = await prisma.user.upsert({
      where: {
        email: 'temp@mindvision.app',
      },
      update: {},
      create: {
        email: 'temp@mindvision.app',
        name: 'Temporary User',
      },
    });

    return NextResponse.json({ 
      data: { 
        userId: tempUser.id,
        email: tempUser.email,
        name: tempUser.name,
      } 
    });
  } catch (error) {
    console.error('Error creating temporary user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 