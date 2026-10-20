import { prisma } from "@/lib/prisma";
import { StorefrontHeader } from "@/components/storefront-header";
import { notFound } from "next/navigation";
import { ShoppingCart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Image from "next/image"; // Note: Since we are using standard img tags for external unsplash in this demo to avoid next.config.js host setup, I will use standard img.

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || product.status !== "ACTIVE") {
    notFound();
  }

  const isSale = product.discountPercentage > 0;
  const price = product.price;
  const salePrice = isSale ? price * (1 - product.discountPercentage / 100) : price;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StorefrontHeader />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Product Image */}
          <div className="relative aspect-[4/5] bg-muted/20 rounded-2xl overflow-hidden border border-border/50">
            {isSale && (
              <div className="absolute top-6 left-6 z-10 bg-[#f2ca50] text-[#121414] text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                {product.discountPercentage}% OFF
              </div>
            )}
            <img 
              src={product.imageUrl || "/api/placeholder/800/1000"} 
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col py-6">
            <div className="mb-6">
              <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">{product.category.name}</span>
              <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-bold text-foreground tracking-tight leading-tight">
                {product.title}
              </h1>
            </div>

            <div className="mb-8 flex items-baseline gap-4">
              {isSale ? (
                <>
                  <span className="text-4xl font-bold text-[#f2ca50]">${salePrice.toFixed(2)}</span>
                  <span className="text-xl text-muted-foreground line-through decoration-1">${price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-4xl font-bold text-foreground">${price.toFixed(2)}</span>
              )}
            </div>

            <div className="prose prose-invert max-w-none mb-10 text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="mb-10 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>2 Year Premium Warranty Included</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-emerald-500" />
                <span>Free Express Shipping over $200</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="w-5 h-5 text-emerald-500" />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>

            <div className="mt-auto border-t border-border/40 pt-8">
              {product.stockQuantity > 0 ? (
                <button className="w-full flex items-center justify-center gap-3 h-16 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b68d28] px-8 text-lg font-bold tracking-widest uppercase text-[#121414] shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] focus-visible:outline-none">
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
              ) : (
                <button disabled className="w-full h-16 rounded-lg bg-muted text-muted-foreground text-lg font-bold tracking-widest uppercase cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-card py-12 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© 2026 CSD Premium Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
