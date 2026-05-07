import { getEvents } from "@/app/actions/eventActions";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const events = await getEvents();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Campus Events</h1>
            <p className="text-muted">Stay updated with the latest happenings at GIKI.</p>
          </div>
          {["ADMIN", "SOCIETY_HEAD", "FACULTY"].includes((session?.user as any)?.role) && (
            <Link
              href="/events/new"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-green-600 hover:bg-green-700 transition-all transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          <div className="bg-card rounded-3xl shadow-sm border border-card-border p-20 text-center">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No upcoming events</h3>
            <p className="text-muted">Check back later or organize your own event!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-card rounded-3xl shadow-sm border border-card-border overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                <div className="bg-green-600 p-6 text-white flex flex-col items-center">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                    {format(new Date(event.date), "MMMM")}
                  </div>
                  <div className="text-5xl font-black">
                    {format(new Date(event.date), "dd")}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-foreground mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-col space-y-2 text-sm text-gray-500 mb-6">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {event.time}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {event.venue}
                    </span>
                  </div>
                  <p className="text-sm text-foreground opacity-80 line-clamp-3 mb-8 leading-relaxed flex-1">
                    {event.description}
                  </p>
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Organized by</span>
                      <span className="text-sm font-bold text-foreground">{event.organizer.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
