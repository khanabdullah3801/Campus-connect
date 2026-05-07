"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userRole = (session.user as any).role;
  const allowedRoles = ["ADMIN", "SOCIETY_HEAD", "FACULTY"];
  
  if (!allowedRoles.includes(userRole)) {
    throw new Error("Only admins, society heads, and faculty members can create events.");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const time = formData.get("time") as string;
  const venue = formData.get("venue") as string;

  if (!title || !description || !dateStr || !time || !venue) {
    throw new Error("All fields are required");
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const userId = (session.user as any).id;

  await prisma.event.create({
    data: {
      title,
      description,
      date,
      time,
      venue,
      organizerId: userId,
    },
  });

  revalidatePath("/events");
}

export async function getEvents() {
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(), // Only show future events
      }
    },
    orderBy: {
      date: "asc",
    },
    include: {
      organizer: {
        select: {
          name: true,
          department: true,
        },
      },
    },
  });

  return events;
}
