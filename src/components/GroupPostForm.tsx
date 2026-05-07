"use client";

import { useState, useRef } from "react";
import { createGroupPost } from "@/app/actions/postActions";

export function GroupPostForm({ groupId }: { groupId: string }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createGroupPost(groupId, content, mediaUrl || undefined);
      setContent("");
      setMediaUrl(null);
    } catch (error: any) {
      alert(error.message || "Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-[32px] shadow-xl shadow-green-900/5 border border-green-50 p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8">
           <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">Official Only</span>
        </div>
        
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-1">Create Announcement</p>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's the update for this hub?"
          className="w-full bg-gray-50/50 border-none rounded-2xl py-5 px-6 text-base font-medium text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all resize-none min-h-[140px] placeholder:text-gray-300"
          required
        />

        {mediaUrl && (
          <div className="mt-4 relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <img src={mediaUrl} alt="Preview" className="w-full max-h-64 object-cover" />
            <button
              type="button"
              onClick={() => setMediaUrl(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 text-gray-400 hover:text-green-600 transition-colors px-4 py-2 rounded-xl hover:bg-green-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">Add Photo</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Publish Announcement"}
          </button>
        </div>
      </div>
    </form>
  );
}
