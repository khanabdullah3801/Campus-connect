import { getPosts } from "@/app/actions/postActions";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { PostForm } from "@/components/PostForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar / Profile Summary */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-card rounded-xl shadow-sm border border-card-border p-6 sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-2">Hello, {session.user.name?.split(' ')[0]}!</h2>
            <p className="text-sm text-muted mb-6">{(session.user as any).email}</p>
            
            <div className="space-y-4">
              <a href="/feed" className="flex items-center text-green-700 font-medium bg-green-50 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                Social Feed
              </a>
              <a href="/marketplace" className="flex items-center text-gray-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Marketplace
              </a>
              <a href="/events" className="flex items-center text-gray-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Events
              </a>
            </div>
          </div>
        </div>

        {/* Main Feed Column */}
        <div className="lg:col-span-2">
          <PostForm />
          
          <div className="space-y-0">
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                <p className="mt-1 text-gray-500">Be the first to share something with the campus!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post as any} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
