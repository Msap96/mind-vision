import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { userId } = await request.json();

    // Validate UUID format for both IDs
    if (
      !z.string().uuid().safeParse(id).success ||
      !z.string().uuid().safeParse(userId).success
    ) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Check if entry exists and belongs to user
    const entry = await prisma.entry.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the entry
    await prisma.entry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}
