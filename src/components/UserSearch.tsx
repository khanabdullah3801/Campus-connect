"use client";

import { useState, useEffect, useRef } from "react";
import { searchUsers } from "@/app/actions/chatActions";
import { useRouter } from "next/navigation";

export function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length >= 2) {
        try {
          const users = await searchUsers(query);
          setResults(users);
          setIsOpen(true);
        } catch (error) {
          console.error("Search failed:", error);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-8" ref={dropdownRef}>
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Start typing a name to message someone..."
          className="w-full px-6 py-5 pl-14 rounded-2xl border-card-border bg-card shadow-sm focus:border-green-500 focus:ring-green-500 transition-all text-foreground font-bold placeholder:text-muted"
        />
        <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-3 w-full bg-card rounded-3xl shadow-2xl border border-card-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3">
            <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Community Results</p>
            {results.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  router.push(`/messages/${user.id}`);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center p-4 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all group text-left"
              >
                <div className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black mr-4 group-hover:scale-110 transition-transform shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none mt-1">{user.department || "GIKI Student"}</p>
                </div>
                <div className="ml-4 p-2 bg-green-100 text-green-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
