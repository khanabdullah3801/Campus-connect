import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, faculty } = await req.json();

    // Enforce GIKI email constraint
    if (!email.endsWith("@giki.edu.pk")) {
      return NextResponse.json(
        { error: "Only @giki.edu.pk emails are allowed" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        department: faculty, // Save faculty to department
        isVerified: true,
      },
    });

    // Automatically join Faculty Group
    if (faculty) {
      // Use the clean faculty code (e.g., FCSE) to find/create the group
      const facultyGroupName = `Faculty of ${faculty}`;
      
      let group = await prisma.group.findFirst({
        where: { 
          OR: [
            { name: facultyGroupName },
            { department: faculty }
          ]
        }
      });

      if (!group) {
        group = await prisma.group.create({
          data: {
            name: facultyGroupName,
            department: faculty,
          }
        });
      }

      // Add user as a member
      await prisma.groupMembership.upsert({
        where: {
          groupId_userId: {
            userId: user.id,
            groupId: group.id,
          }
        },
        update: {},
        create: {
          userId: user.id,
          groupId: group.id,
          role: "MEMBER"
        }
      });
    }


    return NextResponse.json(
      { message: "Registration successful. You have been added to your Faculty Hub!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
