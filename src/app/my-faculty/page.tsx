import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MyFacultyPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !(session.user as any).department) {
    redirect("/societies");
  }

  const department = (session.user as any).department;

  // Find the group that matches the user's department
  const group = await prisma.group.findFirst({
    where: { 
      OR: [
        { department: department },
        { name: { contains: department } }
      ]
    }
  });

  if (group) {
    redirect(`/societies/${group.id}`);
  }

  // Fallback if no hub is found
  redirect("/societies");
}
