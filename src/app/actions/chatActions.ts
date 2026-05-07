"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function sendMessage(receiverId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const senderId = (session.user as any).id;

  if (!content || content.trim().length === 0) {
    throw new Error("Message content cannot be empty");
  }

  await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
    },
  });

  revalidatePath(`/messages/${receiverId}`);
  revalidatePath("/messages");
}

export async function getConversations() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: {
      timestamp: "desc",
    },
    include: {
      sender: { select: { id: true, name: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, profilePicture: true } },
    },
  });

  const conversationsMap = new Map();

  messages.forEach((msg) => {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
    if (!conversationsMap.has(otherUser.id)) {
      conversationsMap.set(otherUser.id, {
        user: otherUser,
        lastMessage: msg.content,
        timestamp: msg.timestamp,
      });
    }
  });

  return Array.from(conversationsMap.values());
}

export async function getMessages(otherUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return messages;
}

export async function markMessagesAsRead(otherUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return;

  const userId = (session.user as any).id;

  await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      receiverId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/messages");
}

export async function getUnreadMessageCount() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return 0;
  
  const userId = (session.user as any).id;
  
  const count = await prisma.message.count({
    where: {
      receiverId: userId,
      isRead: false,
    },
  });
  
  return count;
}

export async function searchUsers(query: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  if (!query || query.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        {
          id: { not: (session.user as any).id },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      department: true,
      profilePicture: true,
    },
    take: 5,
  });

  return users;
}

