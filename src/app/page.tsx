import { prisma } from "@/lib/prisma";
import { StorefrontHeader } from "@/components/storefront-header";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Laptop, Shirt, Watch, Home } from "lucide-react";

export default async function StorefrontPage() {
  const getCategoryImageUrl = (slug: string) => {
    switch (slug) {
      case 'electronics': return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80';
      case 'clothing': return 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80';
      case 'accessories': return 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80';
      case 'home-living': return 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80';
      default: return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
    }
  };

  const categories = await prisma.category.findMany();
  
  // Fetch active products with their categories
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
          <div className="absolute inset-0 z-0">
            {/* The image is fully visible and covers the whole screen */}
            <img 
              src="/csd-outside.png" 
              alt="CSD Store Exterior" 
              className="w-full h-full object-cover object-top opacity-70 animate-zoom-in-slow"
            />
            {/* Sophisticated dark gradient overlay (bottom-heavy) to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-[#121414]/70 to-[#121414]/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121414] via-transparent to-[#121414] z-10" />
          </div>
          
          <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-20">
            <div className="space-y-6 max-w-4xl opacity-0 animate-fade-up">
              <div className="inline-flex items-center rounded-full border border-[#f2ca50]/30 bg-[#f2ca50]/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#f2ca50] backdrop-blur-md">
                Premium Quality Guaranteed
              </div>
              <h1 className="text-7xl font-extrabold tracking-tight sm:text-8xl md:text-[9rem] text-[#f2ca50] font-serif drop-shadow-2xl">
                CSD
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
                The Caring Store
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10">
                <button className="inline-flex h-14 items-center justify-center rounded-sm bg-gradient-to-br from-[#d4af37] to-[#b68d28] px-10 text-sm font-bold tracking-widest uppercase text-[#121414] shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] focus-visible:outline-none">
                  Shop The Collection
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link href={`/category/${category.slug}`} key={category.id} className="group relative rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-[#f2ca50]/50 transition-colors cursor-pointer block">
                  <div className="aspect-square overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                    <img 
                      src={getCategoryImageUrl(category.slug)} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 text-center border-t border-border/50 bg-[#121414]/90 backdrop-blur-sm absolute bottom-0 w-full z-20">
                    <h3 className="font-semibold text-foreground group-hover:text-[#f2ca50] transition-colors">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals / Featured Products */}
        <section id="new-arrivals" className="py-20 bg-muted/10 border-t border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
              <button className="text-sm font-medium text-primary hover:underline">View all</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const isSale = product.discountPercentage > 0;
                const price = product.price;
                const salePrice = isSale ? price * (1 - product.discountPercentage / 100) : price;

                return (
                  <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all hover:-translate-y-1 block">
                    <div className="relative aspect-square bg-muted overflow-hidden">
                      {isSale && (
                        <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                      <img 
                        src={product.imageUrl || "/api/placeholder/400/400"} 
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-xs text-muted-foreground mb-2">{product.category.name}</div>
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2 flex-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          {isSale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-foreground">${salePrice.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-foreground">${price.toFixed(2)}</span>
                          )}
                        </div>
                        <button className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border/40 bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© 2026 CSD Premium Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
