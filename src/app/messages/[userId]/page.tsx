import { getMessages } from "@/app/actions/chatActions";
import { Navbar } from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ChatRoom } from "@/components/ChatRoom";

export default async function ChatPage({ params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const currentUserId = (session.user as any).id;
  
  // Await params in Next.js 15
  const resolvedParams = await params;
  const otherUserId = resolvedParams.userId;

  if (currentUserId === otherUserId) redirect("/messages");

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
    select: { id: true, name: true, department: true },
  });

  if (!otherUser) redirect("/messages");

  const initialMessages = await getMessages(otherUserId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
      <Navbar />
      <ChatRoom 
        otherUser={otherUser} 
        currentUserId={currentUserId} 
        initialMessages={JSON.parse(JSON.stringify(initialMessages))} 
      />
    </div>
  );
}
