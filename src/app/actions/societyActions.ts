"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getSocieties() {
  const societies = await prisma.group.findMany({
    include: {
      _count: { select: { members: true } }
    }
  });
  return societies;
}

export async function joinSociety(societyId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await prisma.groupMembership.upsert({
    where: {
      groupId_userId: {
        groupId: societyId,
        userId: userId,
      },
    },
    update: {},
    create: {
      groupId: societyId,
      userId: userId,
      role: "MEMBER"
    },
  });

  revalidatePath(`/societies/${societyId}`);
  revalidatePath("/societies");
  revalidatePath("/profile");
}

export async function leaveSociety(societyId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await prisma.groupMembership.delete({
    where: {
      groupId_userId: {
        groupId: societyId,
        userId: userId,
      },
    },
  });

  revalidatePath(`/societies/${societyId}`);
  revalidatePath("/societies");
  revalidatePath("/profile");
}


export async function getSocietyDetails(societyId: string) {
  const society = await prisma.group.findUnique({
    where: { id: societyId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, profilePicture: true, department: true } }
        }
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, profilePicture: true, department: true, batch: true } },
          _count: { select: { likes: true, comments: true } }
        }
      }
    }
  });
  return society;
}


export async function checkMembership(societyId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;

  const userId = (session.user as any).id;

  const membership = await prisma.groupMembership.findUnique({
    where: {
      groupId_userId: {
        groupId: societyId,
        userId: userId,
      },
    },
  });

  return !!membership;
}

export async function getMembershipRole(societyId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const userId = (session.user as any).id;

  const membership = await prisma.groupMembership.findUnique({
    where: {
      groupId_userId: {
        groupId: societyId,
        userId: userId,
      },
    },
  });

  return membership?.role || null;
}

