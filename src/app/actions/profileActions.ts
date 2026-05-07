"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const bio = formData.get("bio") as string;
  const batch = formData.get("batch") as string;
  const department = formData.get("department") as string;
  const profilePicture = formData.get("profilePicture") as string;

  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      bio,
      batch,
      department,
      profilePicture,
    },
  });

  revalidatePath("/profile");
}

export async function getMyProfile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, profilePicture: true, department: true, batch: true } },
          _count: { select: { likes: true, comments: true } }
        }
      },
      products: {
        orderBy: { createdAt: "desc" },
        include: {
          seller: { select: { id: true, name: true, email: true, department: true } }
        }
      }
    }
  });

  return user;
}

export async function getPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, profilePicture: true, department: true, batch: true } },
          _count: { select: { likes: true, comments: true } }
        }
      },
      products: {
        orderBy: { createdAt: "desc" },
        include: {
          seller: { select: { id: true, name: true, email: true, department: true } }
        }
      }
    }
  });

  return user;
}
