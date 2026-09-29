"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";
import { getSessionAction, logoutUser } from "@/app/actions/auth";

export function StorefrontHeader() {
  const { count } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getSessionAction().then((session) => {
      if (session?.user) setUser(session.user);
    });
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tighter text-primary">CSD</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Link href="/#new-arrivals" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                New Arrivals
              </Link>
              <Link href="/category/electronics" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Electronics
              </Link>
              <Link href="/category/clothing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Clothing
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            {user?.role === "ADMIN" && (
              <Link href="/admin" className="hidden sm:block text-xs font-medium text-muted-foreground hover:text-primary border border-border px-3 py-1.5 rounded-full transition-colors">
                Admin
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm font-medium text-foreground">{user.name}</span>
                <button onClick={() => logoutUser()} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}

            <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
