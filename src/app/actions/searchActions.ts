"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function globalSearch(query: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  if (!query || query.length < 2) return null;

  const [users, posts, products, societies] = await Promise.all([
    prisma.user.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true, profilePicture: true, department: true },
      take: 5,
    }),
    prisma.post.findMany({
      where: { content: { contains: query, mode: "insensitive" } },
      include: { 
        author: { select: { name: true, id: true } } 
      },
      take: 5,
    }),
    prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    prisma.group.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 5,
    }),
  ]);

  return { users, posts, products, societies };
}
