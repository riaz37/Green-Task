import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch single user
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
