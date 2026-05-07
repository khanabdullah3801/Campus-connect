import { getPublicProfile } from "@/app/actions/profileActions";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { ProductCard } from "@/components/ProductCard";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const resolvedParams = await params;
  const user = await getPublicProfile(resolvedParams.userId);
  
  if (!user) redirect("/feed");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Sidebar: Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-green-600 to-green-700 h-32" />
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-6">
                  <div className="h-32 w-32 rounded-3xl bg-white p-1 shadow-2xl">
                    <div className="h-full w-full rounded-2xl bg-green-50 flex items-center justify-center text-green-700 font-black text-4xl overflow-hidden border border-green-100">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-black text-gray-900 mb-1 leading-tight">{user.name}</h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  {user.department || "Student"} {user.batch && `• Class of ${user.batch}`}
                </p>
                
                <div className="bg-gray-50/80 rounded-2xl p-5 mb-8 border border-gray-100/50">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {user.bio || "This user hasn't added a bio yet."}
                  </p>
                </div>
                
                <Link
                  href={`/messages/${user.id}`}
                  className="block w-full py-4 bg-green-600 hover:bg-green-700 text-white text-center font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95"
                >
                  Message {user.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content: Activity Tabs */}
          <div className="lg:col-span-2">
            <div className="space-y-16">
              {/* Posts Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center tracking-tight">
                    <span className="bg-green-600 w-2 h-8 rounded-full mr-4 shadow-lg shadow-green-100" />
                    Activity
                  </h2>
                </div>
                
                {user.posts.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-20 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-medium">{user.name.split(' ')[0]} hasn't posted anything yet.</p>
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
                  <h2 className="text-2xl font-black text-gray-900 flex items-center tracking-tight">
                    <span className="bg-green-600 w-2 h-8 rounded-full mr-4 shadow-lg shadow-green-100" />
                    Marketplace Listings
                  </h2>
                </div>
                
                {user.products.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-20 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-400 font-medium">{user.name.split(' ')[0]} doesn't have any items for sale.</p>
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
