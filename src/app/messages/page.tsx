import { getConversations } from "@/app/actions/chatActions";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { UserSearch } from "@/components/UserSearch";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const conversations = await getConversations();

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Messages</h1>
        
        <UserSearch />
        
        <div className="bg-card rounded-3xl shadow-sm border border-card-border overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-20 text-center">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No messages yet</h3>
              <p className="text-muted">When you start a conversation, it will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-card-border">
              {conversations.map((conv: any) => (
                <Link
                  key={conv.user.id}
                  href={`/messages/${conv.user.id}`}
                  className="flex items-center p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-xl mr-4 shadow-sm group-hover:scale-105 transition-transform">
                    {conv.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base font-bold text-foreground truncate">{conv.user.name}</p>
                      <p className="text-xs text-muted">
                        {formatDistanceToNow(new Date(conv.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-muted truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="ml-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
