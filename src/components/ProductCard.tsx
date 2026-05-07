"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { deleteProduct } from "@/app/actions/marketplaceActions";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  mediaUrl: string | null;
  createdAt: Date;
  seller: {
    id: string;
    name: string;
    email: string;
    department: string | null;
  };
};

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const isOwner = session?.user && (session.user as any).id === product.seller.id;

  const contactSeller = () => {
    router.push(`/messages/${product.seller.id}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing? This cannot be undone.")) {
      try {
        await deleteProduct(product.id);
      } catch (error) {
        alert("Failed to delete listing");
      }
    }
  };


  return (
    <div className="bg-card rounded-2xl shadow-sm border border-card-border overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
      {/* Image Area */}
      <div className="h-52 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-200 group-hover:from-green-100 group-hover:to-green-200 transition-colors overflow-hidden">
        {product.mediaUrl ? (
          <img src={product.mediaUrl} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
        ) : (
          <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 rounded-full uppercase tracking-widest">
            {product.category}
          </span>
          <span className="text-xl font-black text-green-800">
            Rs. {product.price.toLocaleString()}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">{product.title}</h3>
        <p className="text-sm text-muted line-clamp-2 mb-6 flex-1 leading-relaxed">{product.description}</p>
        
        <div className="pt-4 border-t border-card-border mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href={`/profile/${product.seller.id}`} className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs hover:scale-110 transition-transform">
              {product.seller.name.charAt(0)}
            </Link>
            <div className="flex flex-col">
              <Link href={`/profile/${product.seller.id}`} className="text-xs font-bold text-foreground hover:text-green-700 transition-colors">{product.seller.name}</Link>
              <span className="text-[10px] text-muted font-medium">{product.seller.department || "GIKI Student"}</span>
            </div>
          </div>
          {isOwner ? (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-xl transition-all border border-red-100"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={contactSeller}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Contact
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
