"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { getUnreadMessageCount } from "@/app/actions/chatActions";

// ── Inline SVG icon helpers ──────────────────────────────────────────────────
const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  feed:      "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  market:    "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  events:    "M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z",
  chat:      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  hubs:      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  profile:   "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  faculty:   "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  more:      "M5 12h.01 M12 12h.01 M19 12h.01",
  close:     "M18 6 6 18 M6 6l12 12",
  signout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
};

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadMessageCount();
        setUnreadMessages(count);
      } catch (err) {
        console.error("Failed to fetch unread messages", err);
      }
    };

    if (session) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [session, pathname]);

  useEffect(() => {
    const handleMessagesRead = async () => {
      try {
        const count = await getUnreadMessageCount();
        setUnreadMessages(count);
      } catch (err) {
        // silently ignore
      }
    };
    window.addEventListener("messages-read", handleMessagesRead);
    return () => window.removeEventListener("messages-read", handleMessagesRead);
  }, []);

  // Close drawer on outside tap
  useEffect(() => {
    if (!moreOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [moreOpen]);

  // Close drawer on route change
  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const isActive = (path: string) => pathname === path;
  const hasDepartment = (session?.user as any)?.department;

  // ── Mobile bottom nav items (always visible) ───────────────────────────────
  const mobileNavItems = [
    { href: "/feed",        label: "Feed",    iconKey: "feed" as const },
    { href: "/marketplace", label: "Market",  iconKey: "market" as const },
    { href: "/events",      label: "Events",  iconKey: "events" as const },
    { href: "/messages",    label: "Chat",    iconKey: "chat" as const },
    { href: "/societies",   label: "Hubs",    iconKey: "hubs" as const },
  ];

  return (
    <>
      {/* ── Desktop / tablet top navbar ─────────────────────────────────────── */}
      <nav className="bg-card border-b border-card-border shadow-sm sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/feed" className="text-2xl font-black text-green-700 dark:text-green-500 tracking-tighter flex items-center group">
                  <span className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-green-100">C</span>
                  <span className="hidden xl:block">Campus Connect</span>
                </Link>
              </div>

              <GlobalSearch />

              {/* Desktop links */}
              <div className="hidden lg:flex lg:space-x-1">
                <Link href="/feed" className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                  isActive("/feed") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}>Feed</Link>

                <Link href="/marketplace" className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                  isActive("/marketplace") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}>Market</Link>

                <Link href="/events" className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                  isActive("/events") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}>Events</Link>

                <Link href="/messages" className={`px-4 py-2 rounded-xl text-sm font-black transition-all relative ${
                  isActive("/messages") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}>
                  Chat
                  {unreadMessages > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-slate-900 shadow-sm" />
                  )}
                </Link>

                <Link href="/societies" className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                  isActive("/societies") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}>Hubs</Link>

                {hasDepartment && (
                  <Link href="/my-faculty" className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                    isActive("/my-faculty") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`}>My Faculty</Link>
                )}

                <Link href="/profile" className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                  isActive("/profile") ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}>Me</Link>
              </div>
            </div>

            <div className="flex items-center ml-4 space-x-4">
              <ThemeToggle />
              <NotificationBell />
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hidden sm:block px-6 py-2.5 border-none text-xs font-black uppercase tracking-widest rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-100 dark:shadow-green-900/20 active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom navigation bar (hidden on lg+) ─────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t border-card-border shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map(({ href, label, iconKey }) => {
            const active = isActive(href);
            const isChat = href === "/messages";
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all duration-200 ${
                  active
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400"
                }`}
              >
                <span className={`relative transition-transform duration-200 ${
                  active ? "scale-110" : "scale-100"
                }`}>
                  <Icon d={icons[iconKey]} size={22} />
                  {isChat && unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </span>
                <span className={`text-[10px] font-bold tracking-wide transition-all duration-200 ${
                  active ? "opacity-100" : "opacity-70"
                }`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-green-500 dark:bg-green-400" />
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            aria-label="More navigation options"
            className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl transition-all duration-200 ${
              moreOpen
                ? "text-green-600 dark:text-green-400"
                : "text-gray-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400"
            }`}
          >
            <Icon d={moreOpen ? icons.close : icons.more} size={22} />
            <span className="text-[10px] font-bold tracking-wide opacity-70">More</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile More drawer (slide-up sheet) ──────────────────────────────── */}
      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          aria-label="Navigation drawer backdrop"
          style={{ backdropFilter: "blur(2px)", backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <div
            ref={drawerRef}
            className="absolute bottom-16 left-2 right-2 bg-card border border-card-border rounded-2xl shadow-2xl overflow-hidden"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-slate-700" />
            </div>

            <div className="p-3 grid grid-cols-2 gap-2">
              {/* Profile */}
              <Link
                href="/profile"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive("/profile")
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon d={icons.profile} size={20} />
                Profile
              </Link>

              {/* My Faculty */}
              {hasDepartment && (
                <Link
                  href="/my-faculty"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive("/my-faculty")
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon d={icons.faculty} size={20} />
                  My Faculty
                </Link>
              )}

              {/* Theme toggle row */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-slate-300">
                <ThemeToggle />
                <span className="text-sm font-bold">Theme</span>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <Icon d={icons.signout} size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

