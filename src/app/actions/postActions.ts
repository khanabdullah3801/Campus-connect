"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const content = formData.get("content") as string;
  const mediaUrl = formData.get("mediaUrl") as string;
  
  if (!content || content.trim().length === 0) {
    throw new Error("Post content cannot be empty");
  }

  const userId = (session.user as any).id;

  await prisma.post.create({
    data: {
      content,
      mediaUrl: mediaUrl || null,
      authorId: userId,
    },
  });

  revalidatePath("/feed");
}


export async function getPosts() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  const userId = (session.user as any).id;

  const posts = await prisma.post.findMany({
    where: {
      groupId: null,
    },
    orderBy: {
      createdAt: "desc",
    },

    include: {
      author: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          department: true,
          batch: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      },
      likes: {
        where: {
          userId: userId
        },
        select: {
          userId: true
        }
      }
    },
  });

  return posts.map(post => ({
    ...post,
    isLiked: post.likes.length > 0
  }));
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  });

  if (!post || post.authorId !== userId) {
    throw new Error("You can only delete your own posts");
  }

  await prisma.post.delete({
    where: { id: postId }
  });

  revalidatePath("/feed");
  revalidatePath("/profile");
}

import { createNotification } from "./notificationActions";

export async function createGroupPost(groupId: string, content: string, mediaUrl?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Check if user is an ADMIN or TEACHER in this group
  const membership = await prisma.groupMembership.findUnique({
    where: {
      groupId_userId: {
        userId,
        groupId
      }
    }
  });

  if (!membership || !["ADMIN", "TEACHER"].includes(membership.role)) {
    throw new Error("Only authorized personnel can post announcements in this hub");
  }

  const post = await prisma.post.create({
    data: {
      content,
      mediaUrl: mediaUrl || null,
      authorId: userId,
      groupId: groupId,
    },
    include: {
      group: { select: { name: true } }
    }
  });

  // Automatically notify all members of the group
  const members = await prisma.groupMembership.findMany({
    where: { 
      groupId: groupId,
      NOT: { userId: userId } 
    },
    select: { userId: true }
  });

  // Create notifications for all members
  // In a real production app, this would be a bulk create or background job
  for (const member of members) {
    await createNotification({
      type: "ANNOUNCEMENT",
      content: `Official Update: New announcement in ${post.group?.name}`,
      recipientId: member.userId,
      actorId: userId,
      link: `/societies/${groupId}`
    });
  }

  revalidatePath(`/societies/${groupId}`);
}



