"use client";

import { useState, useEffect, useRef } from "react";
import { getNotifications, markAsRead } from "@/app/actions/notificationActions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    };
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifyClick = async (n: any) => {
    if (!n.isRead) {
      await markAsRead(n.id);
      setNotifications(notifications.map(item => item.id === n.id ? { ...item, isRead: true } : item));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group"
      >
        <svg
          className="w-6 h-6 text-gray-500 group-hover:text-green-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white text-[10px] font-black text-white items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
               <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{unreadCount} New</span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-400 text-xs font-medium">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.link || "#"}
                    onClick={() => handleNotifyClick(n)}
                    className={`flex items-start p-4 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-green-50/30" : ""}`}
                  >
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-black text-sm mr-3 flex-shrink-0">
                      {n.actor?.name?.charAt(0) || "C"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.isRead ? "font-bold text-gray-900" : "text-gray-500"}`}>
                        {n.content}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt))} ago
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="ml-2 w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-green-600 transition-colors">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
