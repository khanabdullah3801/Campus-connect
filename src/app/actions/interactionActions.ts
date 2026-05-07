"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

import { createNotification } from "./notificationActions";

export async function toggleLike(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
  } else {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, content: true }
    });
    
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    if (post && post.authorId !== userId) {
      await createNotification({
        type: "LIKE",
        content: `${session.user.name} liked your post.`,
        recipientId: post.authorId,
        actorId: userId,
        link: "/feed"
      });
    }
  }

  revalidatePath("/feed");
  revalidatePath("/profile");
}

export async function addComment(postId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  if (!content || content.trim().length === 0) {
    throw new Error("Comment cannot be empty");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true }
  });

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: userId,
    },
  });

  if (post && post.authorId !== userId) {
    await createNotification({
      type: "COMMENT",
      content: `${session.user.name} commented on your post.`,
      recipientId: post.authorId,
      actorId: userId,
      link: "/feed"
    });
  }

  revalidatePath("/feed");
  revalidatePath("/profile");
}


export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, name: true, profilePicture: true, department: true }
      }
    }
  });

  return comments;
}
