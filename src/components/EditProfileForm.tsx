"use client";

import { useState, useRef } from "react";
import { updateProfile } from "@/app/actions/profileActions";

export function EditProfileForm({ user }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    if (imagePreview) {
      formData.set("profilePicture", imagePreview);
    }
    try {
      await updateProfile(formData);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-background hover:bg-card text-foreground font-bold rounded-2xl transition-all active:scale-95 border border-card-border"
      >
        Edit Profile Settings
      </button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-6 bg-background/50 p-6 rounded-[32px] border border-card-border">
        
        {/* Avatar Upload */}
        <div className="flex flex-col items-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative h-24 w-24 rounded-[28px] overflow-hidden bg-card border-2 border-dashed border-card-border cursor-pointer hover:border-green-400 group transition-all"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-3">Upload Profile Photo</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5 pl-1">Department</label>
            <input
              name="department"
              defaultValue={user.department || ""}
              className="w-full px-4 py-3 rounded-xl border-card-border bg-card text-sm font-bold text-foreground focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              placeholder="e.g. FCSE"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5 pl-1">Batch</label>
            <input
              name="batch"
              defaultValue={user.batch || ""}
              className="w-full px-4 py-3 rounded-xl border-card-border bg-card text-sm font-bold text-foreground focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              placeholder="e.g. 2024"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5 pl-1">Profile Bio</label>
          <textarea
            name="bio"
            defaultValue={user.bio || ""}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-card-border bg-card text-sm font-bold text-foreground focus:ring-green-500 focus:border-green-500 transition-all resize-none shadow-sm"
            placeholder="Tell the community about yourself..."
          />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 py-4 bg-card text-muted font-black uppercase tracking-widest rounded-2xl text-[10px] border border-card-border hover:bg-background transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded-2xl text-[10px] shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}
