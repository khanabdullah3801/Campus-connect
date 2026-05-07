"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access only.");
  }
  return session;
}

export async function getAllUsers(query?: string) {
  await verifyAdmin();
  
  const users = await prisma.user.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ]
    } : {},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  
  return users;
}

export async function updateUserRole(userId: string, newRole: any) {
  await verifyAdmin();
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
  
  revalidatePath("/admin");
}

export async function assignGroupRole(groupId: string, userId: string, role: any) {
  await verifyAdmin();
  
  await prisma.groupMembership.upsert({
    where: {
      groupId_userId: {
        groupId,
        userId
      }
    },
    update: { role },
    create: {
      groupId,
      userId,
      role
    }
  });
  
  revalidatePath("/admin");
  revalidatePath(`/societies/${groupId}`);
}

export async function getAdminStats() {
  await verifyAdmin();
  
  const [userCount, postCount, productCount, groupCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.product.count(),
    prisma.group.count(),
  ]);
  
  return { userCount, postCount, productCount, groupCount };
}

export async function getAllGroups() {
  await verifyAdmin();
  return prisma.group.findMany({
    select: { id: true, name: true, department: true }
  });
}
