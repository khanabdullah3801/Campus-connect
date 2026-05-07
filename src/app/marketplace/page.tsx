import { getProducts } from "@/app/actions/marketplaceActions";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const params = await searchParams;
  const category = params.category || "All";
  const products = await getProducts(category);

  const categories = ["All", "Electronics", "Books", "Furniture", "Clothing", "Other"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Campus Marketplace</h1>
            <p className="text-muted">Buy and sell items within the GIKI community.</p>
          </div>
          <Link
            href="/marketplace/new"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-green-600 hover:bg-green-700 transition-all transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            List an Item
          </Link>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-4 mb-10 gap-3 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/marketplace?category=${cat}`}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${
                category === cat
                  ? "bg-green-800 border-green-800 text-white shadow-md scale-105"
                  : "bg-card border-card-border text-muted hover:border-green-200 hover:text-green-700"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-card rounded-3xl shadow-sm border border-card-border p-20 text-center">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No items found</h3>
            <p className="text-muted max-w-sm mx-auto">It looks like there are no listings in this category yet. Be the first to sell something!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
