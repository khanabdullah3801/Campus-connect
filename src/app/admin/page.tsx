import { Navbar } from "@/components/Navbar";
import { getAdminStats, getAllUsers, getAllGroups } from "@/app/actions/adminActions";
import { AdminUserList } from "@/components/AdminUserList";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/feed");
  }

  const stats = await getAdminStats();
  const users = await getAllUsers();
  const groups = await getAllGroups();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Campus Control Center</h1>
          <p className="text-gray-500 font-medium">Manage users, roles, and official faculty hubs.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Students", value: stats.userCount, color: "bg-blue-500" },
            { label: "Live Posts", value: stats.postCount, color: "bg-green-500" },
            { label: "Active Listings", value: stats.productCount, color: "bg-amber-500" },
            { label: "Hubs & Societies", value: stats.groupCount, color: "bg-purple-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 group-hover:scale-110 transition-transform origin-left">{stat.value}</p>
              <div className={`h-1 w-12 ${stat.color} mt-4 rounded-full`} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Management Section */}
          <div className="lg:col-span-3">
            <section className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">User Management</h2>
                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                  Real-time Control
                </span>
              </div>
              <div className="p-8">
                <AdminUserList initialUsers={users} groups={groups} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
