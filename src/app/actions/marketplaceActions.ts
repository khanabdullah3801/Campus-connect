"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const category = formData.get("category") as string;
  const mediaUrl = formData.get("mediaUrl") as string;

  if (!title || !description || !priceStr || !category) {
    throw new Error("All fields are required");
  }

  const price = parseFloat(priceStr);
  if (isNaN(price)) {
    throw new Error("Price must be a valid number");
  }

  const userId = (session.user as any).id;

  await prisma.product.create({
    data: {
      title,
      description,
      price,
      category,
      sellerId: userId,
      mediaUrl: mediaUrl || null,
    },
  });


  revalidatePath("/marketplace");
}

export async function getProducts(category?: string) {
  const whereClause = category && category !== "All" ? { category } : {};
  
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
        },
      },
    },
  });

  return products;
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true }
  });

  if (!product || product.sellerId !== userId) {
    throw new Error("You can only delete your own listings");
  }

  await prisma.product.delete({
    where: { id: productId }
  });

  revalidatePath("/marketplace");
  revalidatePath("/profile");
}

