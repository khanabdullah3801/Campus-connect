"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/actions/eventActions";
import { Navbar } from "@/components/Navbar";

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await createEvent(formData);
      router.push("/events");
    } catch (error: any) {
      alert(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-green-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-black tracking-tight mb-2">Organize an Event</h1>
            <p className="text-green-100 font-medium">Post your society events or campus workshops here.</p>
          </div>
          
          <form action={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. ACM Tech Talk, IEEE Workshop, NetSols Recruitment"
                className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 text-gray-900 bg-gray-50 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 text-gray-900 bg-gray-50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  required
                  placeholder="e.g. 5:00 PM - 7:00 PM"
                  className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 text-gray-900 bg-gray-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-bold text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                placeholder="e.g. AHS Auditorium, Seminar Hall 1"
                className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 text-gray-900 bg-gray-50 transition-all"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Tell us more about the event. Who is the speaker? What will be covered?"
                className="block w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 text-gray-900 bg-gray-50 transition-all resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
