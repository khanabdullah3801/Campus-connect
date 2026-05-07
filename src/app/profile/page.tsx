import { getMyProfile } from "@/app/actions/profileActions";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/EditProfileForm";

export default async function ProfilePage() {
  const user = await getMyProfile();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sidebar: Profile Summary & Edit */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-[32px] shadow-xl border border-card-border overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-green-600 to-green-700 h-32" />
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <div className="h-32 w-32 rounded-3xl bg-card p-1 shadow-2xl">
                    <div className="h-full w-full rounded-2xl bg-green-50 flex items-center justify-center text-green-700 font-black text-4xl overflow-hidden border border-green-100">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-black text-foreground mb-1 leading-tight">{user.name}</h1>
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-6">
                  {user.department || "Student"} {user.batch && `• Class of ${user.batch}`}
                </p>
                
                <div className="bg-background/80 rounded-2xl p-5 mb-8 border border-card-border/50">
                  <p className="text-foreground/80 text-sm leading-relaxed italic">
                    "{user.bio || "No bio yet. Tell the GIKI community about yourself!"}"
                  </p>
                </div>
                
                <EditProfileForm user={user} />
              </div>
            </div>
          </div>

          {/* Main Content: Activity Tabs */}
          <div className="lg:col-span-2">
            <div className="space-y-16">
              {/* Posts Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-foreground flex items-center tracking-tight">
                    <span className="bg-green-600 w-2 h-8 rounded-full mr-4 shadow-lg shadow-green-100" />
                    Your Activity
                  </h2>
                </div>
                
                {user.posts.length === 0 ? (
                  <div className="bg-card rounded-[32px] p-20 text-center border-2 border-dashed border-card-border shadow-sm">
                    <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted/30">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No posts yet</h3>
                    <p className="text-muted font-medium">Start sharing updates on the social feed!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {user.posts.map((post) => (
                      <PostCard key={post.id} post={post as any} />
                    ))}
                  </div>
                )}
              </section>

              {/* Products Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-foreground flex items-center tracking-tight">
                    <span className="bg-green-600 w-2 h-8 rounded-full mr-4 shadow-lg shadow-green-100" />
                    Marketplace Listings
                  </h2>
                </div>
                
                {user.products.length === 0 ? (
                  <div className="bg-card rounded-[32px] p-20 text-center border-2 border-dashed border-card-border shadow-sm">
                    <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted/30">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No items listed</h3>
                    <p className="text-muted font-medium">Sell your old books or gear in the marketplace!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {user.products.map((product) => (
                      <ProductCard key={product.id} product={product as any} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
