import { getSocietyDetails, checkMembership, getMembershipRole } from "@/app/actions/societyActions";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { JoinSocietyButton } from "@/components/JoinSocietyButton";
import { GroupPostForm } from "@/components/GroupPostForm";
import { PostCard } from "@/components/PostCard";

export default async function SocietyHubPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const society = await getSocietyDetails(resolvedParams.id);
  
  if (!society) redirect("/societies");

  const isMember = await checkMembership(resolvedParams.id);
  const userRole = await getMembershipRole(resolvedParams.id);
  const canPost = userRole === "ADMIN" || userRole === "TEACHER";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sidebar: Society Stats & Join */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-[32px] shadow-xl border border-card-border overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-green-600 to-green-700 h-32 flex items-center justify-center">
                <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-3xl border border-white/30">
                  {society.name.charAt(0)}
                </div>
              </div>
              <div className="px-8 pb-8 pt-6">
                <h1 className="text-2xl font-black text-foreground mb-1 leading-tight tracking-tight">{society.name}</h1>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">
                  {society.department} Chapter
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-background p-4 rounded-2xl border border-card-border text-center">
                    <p className="text-2xl font-black text-green-700">{society.members.length}</p>
                    <p className="text-[10px] font-bold text-muted uppercase">Members</p>
                  </div>
                  <div className="bg-background p-4 rounded-2xl border border-card-border text-center">
                    <p className="text-2xl font-black text-green-700">{society.posts.length}</p>
                    <p className="text-[10px] font-bold text-muted uppercase">Announcements</p>
                  </div>
                </div>
                
                <JoinSocietyButton societyId={society.id} isMember={isMember} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Announcements Feed */}
            <section>
              <h2 className="text-2xl font-black text-foreground flex items-center tracking-tight mb-8">
                <span className="bg-green-600 w-2 h-8 rounded-full mr-4 shadow-lg shadow-green-100" />
                Faculty Announcements
              </h2>

              {canPost && <GroupPostForm groupId={society.id} />}

              <div className="space-y-6">
                {society.posts.length === 0 ? (
                  <div className="bg-card rounded-[32px] border border-card-border p-20 text-center shadow-sm">
                    <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted/30">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">No announcements yet</h3>
                    <p className="text-sm text-muted font-medium">Official updates from teachers and admins will appear here.</p>
                  </div>
                ) : (
                  society.posts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </section>

            {/* Member Directory */}
            <section>
              <h2 className="text-2xl font-black text-foreground flex items-center tracking-tight mb-8">
                <span className="bg-green-600 w-2 h-8 rounded-full mr-4 shadow-lg shadow-green-100" />
                Member Directory
              </h2>
              
              <div className="bg-card rounded-[32px] shadow-sm border border-card-border overflow-hidden">
                {society.members.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-gray-400 font-medium">No members yet. Be the first to join!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-card-border">
                    {society.members.map((membership: any) => (
                      <Link
                        key={membership.user.id}
                        href={`/profile/${membership.user.id}`}
                        className="flex items-center p-6 hover:bg-background transition-colors group"
                      >
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-lg mr-4 shadow-sm group-hover:scale-105 transition-transform">
                          {membership.user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-foreground truncate flex items-center">
                            {membership.user.name}
                            {membership.role !== "MEMBER" && (
                              <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-200">
                                {membership.role}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted font-medium">{membership.user.department || "GIKI Student"}</p>
                        </div>
                        <div className="ml-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}

