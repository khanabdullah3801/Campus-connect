"use client";

import { useRef, useState } from "react";
import { createPost } from "@/app/actions/postActions";

export function PostForm() {
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size validation (limit to 2MB for Base64 storage)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function action(formData: FormData) {
    setIsPending(true);
    
    // Add the image to the formData if it exists
    if (imagePreview) {
      formData.set("mediaUrl", imagePreview);
    }
    
    try {
      await createPost(formData);
      formRef.current?.reset();
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-card rounded-[32px] shadow-sm border border-card-border p-8 mb-10 transition-all hover:shadow-md">
      <form ref={formRef} action={action}>
        <div className="mb-4">
          <textarea
            id="content"
            name="content"
            rows={3}
            className="block w-full rounded-2xl border-none shadow-none focus:ring-0 sm:text-lg p-0 bg-card text-foreground font-medium placeholder:text-muted resize-none transition-all"
            placeholder="Share an update with GIKI community..."
            required
            disabled={isPending}
          />
        </div>

        {imagePreview && (
          <div className="relative mb-6 group animate-in fade-in zoom-in-95 duration-300">
            <img src={imagePreview} alt="Preview" className="w-full h-72 object-cover rounded-[24px] border border-gray-100 dark:border-slate-700 shadow-sm" />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all backdrop-blur-md shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-700/50">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all group"
              title="Add Image"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-black uppercase tracking-widest hidden sm:inline">Photo</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center px-10 py-3.5 border border-transparent text-sm font-black rounded-2xl shadow-xl shadow-green-100 dark:shadow-green-900/20 text-white bg-green-600 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Sharing..." : "Post Update"}
          </button>
        </div>
      </form>
    </div>
  );

}
