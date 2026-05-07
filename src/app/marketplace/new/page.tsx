"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/actions/marketplaceActions";
import { Navbar } from "@/components/Navbar";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
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
      formData.set("mediaUrl", imagePreview);
    }
    try {
      await createProduct(formData);
      router.push("/marketplace");
    } catch (error: any) {
      alert(error.message || "Failed to list item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-card rounded-3xl shadow-xl border border-card-border overflow-hidden">
          <div className="bg-green-600 px-8 py-10 text-white">
            <h1 className="text-3xl font-black tracking-tight mb-2">Sell an Item</h1>
            <p className="text-green-100 font-medium text-sm">Fill in the details to list your item in the GIKI community.</p>
          </div>
          
          <form action={handleSubmit} className="p-8 space-y-8">
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-3 ml-1">Product Photo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-72 w-full rounded-[24px] border-2 border-dashed border-card-border bg-background flex flex-col items-center justify-center cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all overflow-hidden group ${imagePreview ? 'border-none' : ''}`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-white font-bold text-sm">
                        Change Photo
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-card p-5 rounded-[24px] shadow-sm mb-4 inline-block border border-card-border group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-foreground font-black text-lg">Upload product image</p>
                    <p className="text-muted text-xs mt-2 font-bold uppercase tracking-widest">PNG, JPG up to 2MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-2 ml-1">Product Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Calculus Textbook, Room Heater, etc."
                  className="block w-full px-5 py-4 rounded-2xl border-card-border focus:border-green-500 focus:ring-green-500 text-foreground bg-background font-bold transition-all placeholder:text-muted placeholder:font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-2 ml-1">Price (Rs.)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-bold text-sm">Rs.</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      placeholder="0.00"
                      className="block w-full pl-14 pr-5 py-4 rounded-2xl border-card-border focus:border-green-500 focus:ring-green-500 text-foreground bg-background font-black transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-2 ml-1">Category</label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="block w-full px-5 py-4 rounded-2xl border-card-border focus:border-green-500 focus:ring-green-500 text-foreground bg-background font-bold transition-all"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Books">Books</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-black text-muted uppercase tracking-[0.2em] mb-2 ml-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  placeholder="Tell buyers more about the item's condition, age, and where they can pick it up."
                  className="block w-full px-5 py-4 rounded-2xl border-card-border focus:border-green-500 focus:ring-green-500 text-foreground bg-background font-medium transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 text-sm font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? "Listing..." : "Post Listing"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
