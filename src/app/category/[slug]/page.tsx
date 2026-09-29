import { prisma } from "@/lib/prisma";
import { StorefrontHeader } from "@/components/storefront-header";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { 
      categoryId: category.id,
      status: "ACTIVE" 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StorefrontHeader />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 border-b border-border/40 pb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
            {category.name}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Explore our curated selection of premium {category.name.toLowerCase()}.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-border/40">
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">We're restocking soon. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isSale = product.discountPercentage > 0;
              const price = product.price;
              const salePrice = isSale ? price * (1 - product.discountPercentage / 100) : price;

              return (
                <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all hover:-translate-y-1 block">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    {isSale && (
                      <div className="absolute top-3 left-3 z-10 bg-[#f2ca50] text-[#121414] text-xs font-bold px-3 py-1 rounded-full">
                        {product.discountPercentage}% OFF
                      </div>
                    )}
                    <img 
                      src={product.imageUrl || "/api/placeholder/400/400"} 
                      alt={product.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">{category.name}</div>
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 flex-1 group-hover:text-[#f2ca50] transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/30">
                      <div>
                        {isSale ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#f2ca50]">${salePrice.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-foreground">${price.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-[#f2ca50]/10 flex items-center justify-center text-[#f2ca50] transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 bg-card py-12 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© 2026 CSD Premium Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
