"use client";

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toggleLike } from "@/app/actions/interactionActions";
import { deletePost } from "@/app/actions/postActions";
import { CommentSection } from "./CommentSection";

type Post = {
  id: string;
  content: string;
  mediaUrl: string | null;
  createdAt: Date;
  isLiked?: boolean;
  author: {
    id: string;
    name: string;
    profilePicture: string | null;
    department: string | null;
    batch: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
};

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const isOwner = session?.user && (session.user as any).id === post.author.id;

  const handleLike = async () => {
    // Optimistic UI update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);
    
    try {
      await toggleLike(post.id);
    } catch (error) {
      // Revert if failed
      setIsLiked(!newLikedState);
      setLikesCount(newLikedState ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      try {
        await deletePost(post.id);
      } catch (error) {
        alert("Failed to delete post");
      }
    }
  };


  // Simple initials fallback if no profile picture
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-card-border p-7 mb-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Link href={`/profile/${post.author.id}`}>
            {post.author.profilePicture ? (
              <img
                src={post.author.profilePicture}
                alt={post.author.name}
                className="h-14 w-14 rounded-2xl object-cover border border-card-border"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-700 dark:text-green-400 font-black text-xl border border-green-100 dark:border-green-900/30 shadow-sm">
                {initials}
              </div>
            )}
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/profile/${post.author.id}`} className="text-base font-black text-foreground hover:text-green-700 transition-colors">
                {post.author.name}
              </Link>
              <p className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2 mt-0.5">
                {post.author.department && <span>{post.author.department}</span>}
                {post.author.department && post.author.batch && <span className="h-1 w-1 bg-card-border rounded-full" />}
                {post.author.batch && <span>Class of {post.author.batch}</span>}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <p className="text-[10px] font-bold text-muted">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
              
              {!isOwner && (
                <button 
                  onClick={() => router.push(`/messages/${post.author.id}`)}
                  className="p-2.5 text-muted hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all shadow-sm border border-transparent hover:border-green-100"
                  title="Message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              )}

              {isOwner && (
                <button 
                  onClick={handleDelete}
                  className="p-2.5 text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                  title="Delete Post"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

          </div>
          
          <div className="mt-4 text-foreground text-sm md:text-base whitespace-pre-wrap leading-relaxed font-medium">
            {post.content}
          </div>

          {post.mediaUrl && (
            <div className="mt-4 rounded-[24px] overflow-hidden border border-card-border shadow-sm">
              <img src={post.mediaUrl} alt="Post media" className="w-full max-h-[500px] object-cover" />
            </div>
          )}

          {/* Engagement Actions */}

          <div className="mt-6 pt-5 border-t border-gray-50 dark:border-slate-700/50 flex items-center space-x-10">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-90 ${
                isLiked ? "text-red-500" : "text-gray-400 dark:text-slate-500 hover:text-red-500"
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isLiked ? "bg-red-50 dark:bg-red-900/20" : "hover:bg-red-50 dark:hover:bg-red-900/20"}`}>
                <svg className={`w-5 h-5 ${isLiked ? "fill-current" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span>{likesCount} Likes</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-2 text-xs font-black uppercase tracking-widest transition-all hover:scale-110 ${
                showComments ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400"
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${showComments ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-green-50 dark:hover:bg-green-900/20"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span>{post._count.comments} Comments</span>
            </button>
          </div>

          {showComments && <CommentSection postId={post.id} />}
        </div>
      </div>
    </div>
  );

}
