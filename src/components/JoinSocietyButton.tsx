"use client";

import { useState } from "react";
import { joinSociety, leaveSociety } from "@/app/actions/societyActions";

export function JoinSocietyButton({ societyId, isMember }: { societyId: string, isMember: boolean }) {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(isMember);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (joined) {
        await leaveSociety(societyId);
        setJoined(false);
      } else {
        await joinSociety(societyId);
        setJoined(true);
      }
    } catch (error) {
      console.error(error);
      alert("Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg active:scale-95 ${
        joined
          ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none"
          : "bg-green-600 text-white hover:bg-green-700 shadow-green-100"
      }`}
    >
      {loading ? "Processing..." : joined ? "Leave Hub" : "Join Society"}
    </button>
  );
}

