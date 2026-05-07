"use client";

import { useState, useEffect, useRef } from "react";
import { globalSearch } from "@/app/actions/searchActions";
import Link from "next/link";

// ── Shared results panel (used in both desktop dropdown & mobile overlay) ──────
function SearchResults({
  results,
  onClose,
}: {
  results: any;
  onClose: () => void;
}) {
  const empty =
    results.users.length === 0 &&
    results.posts.length === 0 &&
    results.products.length === 0 &&
    results.societies.length === 0;

  return (
    <div className="p-3 space-y-2">
      {/* Users */}
      {results.users.length > 0 && (
        <div>
          <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Community</p>
          {results.users.map((user: any) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              onClick={onClose}
              className="flex items-center p-3 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-black text-sm mr-4 group-hover:scale-110 transition-transform">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{user.department || "GIKI Student"}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Societies */}
      {results.societies.length > 0 && (
        <div className="pt-2 border-t border-gray-50 dark:border-slate-700/50">
          <p className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Societies</p>
          {results.societies.map((society: any) => (
            <Link
              key={society.id}
              href={`/societies/${society.id}`}
              onClick={onClose}
              className="flex items-center p-3 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-sm mr-4 group-hover:scale-110 transition-transform">
                {society.name.charAt(0)}
              </div>
              <p className="text-sm font-black text-foreground truncate">{society.name}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      {results.products.length > 0 && (
        <div className="pt-2 border-t border-gray-50 dark:border-slate-700/50">
          <p className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Marketplace</p>
          {results.products.map((product: any) => (
            <Link
              key={product.id}
              href="/marketplace"
              onClick={onClose}
              className="flex items-center p-3 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-400 mr-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0m-4 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground truncate">{product.title}</p>
                <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase">Rs. {product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Posts */}
      {results.posts.length > 0 && (
        <div className="pt-2 border-t border-gray-50 dark:border-slate-700/50">
          <p className="px-4 py-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Conversations</p>
          {results.posts.map((post: any) => (
            <Link
              key={post.id}
              href="/feed"
              onClick={onClose}
              className="block p-4 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all group"
            >
              <p className="text-sm font-medium text-foreground opacity-80 line-clamp-2 mb-2 leading-relaxed">{post.content}</p>
              <p className="text-[9px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest">Post by {post.author.name}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Empty */}
      {empty && (
        <div className="p-10 text-center animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-gray-50 dark:bg-slate-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-slate-700">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm font-black text-foreground">No matches found</p>
          <p className="text-xs text-muted mt-1 font-medium">Try searching for something else</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────
export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile overlay visibility
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const performSearch = async () => {
      if (query.length >= 2) {
        try {
          const data = await globalSearch(query);
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error("Search failed:", error);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    };
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile overlay on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobile();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Auto-focus mobile input when overlay opens
  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 80);
    }
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setQuery("");
    setResults(null);
    setIsOpen(false);
  };

  const closeDesktop = () => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
  };

  return (
    <>
      {/* ── Desktop inline search bar (lg+) ───────────────────────────────── */}
      <div className="relative flex-1 max-w-sm mx-8 hidden lg:block" ref={dropdownRef}>
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search campus..."
            className="w-full bg-background border border-card-border rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold text-foreground focus:bg-card focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 placeholder:font-medium shadow-inner"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 dark:text-slate-600 group-focus-within:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {isOpen && results && (
          <div className="absolute z-[100] mt-3 w-[400px] bg-card rounded-[32px] shadow-2xl border border-card-border overflow-hidden max-h-[80vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            <SearchResults results={results} onClose={closeDesktop} />
          </div>
        )}
      </div>

      {/* ── Mobile search icon button (< lg) ──────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open search"
        className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ml-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* ── Mobile full-screen search overlay ─────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] flex flex-col bg-background animate-in fade-in duration-150">
          {/* Overlay header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border bg-card shadow-sm">
            <div className="relative flex-1">
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search campus..."
                className="w-full bg-background border border-card-border rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400 placeholder:font-medium"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={closeMobile}
              className="shrink-0 px-3 py-2 text-sm font-bold text-gray-500 dark:text-slate-400 hover:text-green-600 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Results scroll area */}
          <div className="flex-1 overflow-y-auto">
            {results && isOpen ? (
              <SearchResults results={results} onClose={closeMobile} />
            ) : query.length === 0 ? (
              /* Prompt state */
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40 px-8 text-center">
                <svg className="w-14 h-14 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm font-bold text-foreground">Search for people, posts,<br />societies &amp; marketplace</p>
              </div>
            ) : (
              /* Typing but < 2 chars */
              <div className="flex items-center justify-center h-full opacity-40">
                <p className="text-sm text-muted font-medium">Keep typing…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
