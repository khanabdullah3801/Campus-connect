"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return [];

  const userId = (session.user as any).id;

  return prisma.notification.findMany({
    where: { recipientId: userId },
    include: {
      actor: { select: { name: true, profilePicture: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}

export async function markAsRead(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return;

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });

  revalidatePath("/");
}

export async function createNotification(data: {
  type: "LIKE" | "COMMENT" | "MESSAGE" | "ANNOUNCEMENT" | "SYSTEM";
  content: string;
  recipientId: string;
  actorId?: string;
  link?: string;
}) {
  // Prevent notifying oneself
  if (data.actorId === data.recipientId) return null;

  return prisma.notification.create({
    data: {
      type: data.type,
      content: data.content,
      recipientId: data.recipientId,
      actorId: data.actorId,
      link: data.link
    }
  });
}
