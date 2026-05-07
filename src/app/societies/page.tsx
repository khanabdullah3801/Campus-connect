import { getSocieties } from "@/app/actions/societyActions";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default async function SocietiesPage() {
  const societies = await getSocieties();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-3">Society Hubs</h1>
          <p className="text-muted font-medium text-lg">Connect with GIKI's vibrant student organizations and find your community.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {societies.map((society) => (
            <Link
              key={society.id}
              href={`/societies/${society.id}`}
              className="group bg-card rounded-[32px] p-10 shadow-sm border border-card-border hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col"
            >
              <div className="h-20 w-20 rounded-[24px] bg-green-50 flex items-center justify-center text-green-700 font-black text-3xl mb-8 group-hover:scale-110 transition-all border border-green-100 shadow-sm shadow-green-50">
                {society.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2 group-hover:text-green-700 transition-colors tracking-tight">
                {society.name}
              </h2>
              <p className="text-base text-muted line-clamp-3 mb-10 flex-1 leading-relaxed">
                {society.department} Chapter • Dedicated to excellence and community at GIKI.
              </p>
              <div className="pt-8 border-t border-card-border flex items-center justify-between">
                <div className="flex items-center text-xs font-black text-muted uppercase tracking-[0.2em]">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {society._count.members} Members
                </div>
                <span className="text-green-600 font-black text-sm group-hover:translate-x-1 transition-transform">Enter Hub</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
