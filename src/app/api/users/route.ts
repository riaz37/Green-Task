import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

// Token verification using jsonwebtoken
async function verifyToken(token: string): Promise<boolean> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

// User creation endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return NextResponse.json({ 
      user, 
      token 
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("User creation error:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// Retrieve users endpoint
export async function GET(req: NextRequest) {
  try {
    // Verify JWT token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to retrieve users", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
