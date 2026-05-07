"use client";

import { useState, useEffect } from "react";
import { addComment, getComments } from "@/app/actions/interactionActions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      await addComment(postId, content);
      setContent("");
      await fetchComments();
    } catch (error) {
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {fetching ? (
          <div className="flex flex-col space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-gray-100" />
                <div className="flex-1 bg-gray-100 h-16 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs font-bold text-gray-300 py-4 uppercase tracking-widest">No comments yet. Start the conversation!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 group">
                <div className="flex-shrink-0">
                  <Link href={`/profile/${comment.author.id}`}>
                    <div className="h-9 w-9 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 font-black text-sm border border-green-100 group-hover:scale-110 transition-transform">
                      {comment.author.name.charAt(0)}
                    </div>
                  </Link>
                </div>
                <div className="flex-1 bg-gray-50/80 rounded-[20px] px-5 py-3 border border-gray-100/50 group-hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <Link href={`/profile/${comment.author.id}`} className="text-xs font-black text-gray-900 hover:text-green-700 transition-colors">
                      {comment.author.name}
                    </Link>
                    <span className="text-[10px] font-bold text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-3 mt-6 sticky bottom-0 bg-white py-2">
        <div className="flex-1 relative group">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="p-3 bg-green-600 text-white hover:bg-green-700 rounded-2xl transition-all shadow-lg shadow-green-100 disabled:opacity-30 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
