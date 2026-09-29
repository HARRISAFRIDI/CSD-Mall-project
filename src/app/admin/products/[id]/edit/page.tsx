import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Save, ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product" };

async function updateProduct(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const discountPercentage = parseFloat(formData.get("discountPercentage") as string) || 0;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10) || 0;
  let categoryId = formData.get("categoryId") as string;
  const newCategoryName = formData.get("newCategoryName") as string;
  let imageUrl = formData.get("imageUrl") as string || "";
  const status = formData.get("status") as string;
  const imageFile = formData.get("imageFile") as File | null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}
    
    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    await writeFile(join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  } else {
    // Extract true image URL if user pastes a Google Image Search link
    try {
      if (imageUrl && imageUrl.includes("google.") && imageUrl.includes("imgres")) {
        const urlObj = new URL(imageUrl);
        const extractedImgUrl = urlObj.searchParams.get("imgurl");
        if (extractedImgUrl) {
          imageUrl = extractedImgUrl;
        }
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  }

  if (categoryId === "CUSTOM" || !categoryId) {
    if (newCategoryName.trim()) {
      const existing = await prisma.category.findFirst({
        where: { name: newCategoryName.trim() }
      });
      if (existing) {
        categoryId = existing.id;
      } else {
        const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newCat = await prisma.category.create({
          data: { name: newCategoryName.trim(), slug }
        });
        categoryId = newCat.id;
      }
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      title,
      sku,
      description,
      price,
      discountPercentage,
      stockQuantity,
      categoryId,
      imageUrl,
      status,
    },
  });

  redirect("/admin/products");
}

async function deleteProduct(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  
  // Delete related order items first to avoid foreign key constraint errors
  await prisma.orderItem.deleteMany({
    where: { productId: id },
  });

  await prisma.product.delete({
    where: { id },
  });

  redirect("/admin/products");
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const id = p.id;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground text-sm mt-1">Update product information.</p>
          </div>
        </div>
        
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <Trash className="w-4 h-4" />
            Delete Product
          </button>
        </form>
      </div>

      <form action={updateProduct} className="space-y-8">
        <input type="hidden" name="id" value={product.id} />
        
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Product Title</label>
              <input
                id="title"
                name="title"
                defaultValue={product.title}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sku" className="text-sm font-medium">SKU</label>
              <input
                id="sku"
                name="sku"
                defaultValue={product.sku}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product.categoryId}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="CUSTOM">-- Custom / New Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                id="newCategoryName"
                name="newCategoryName"
                placeholder="Or type a new category name here..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={product.status}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Pricing & Inventory</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.price}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="discountPercentage" className="text-sm font-medium">Discount (%)</label>
              <input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                defaultValue={product.discountPercentage}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stockQuantity" className="text-sm font-medium">Stock</label>
              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                defaultValue={product.stockQuantity}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Media</h2>
          
          <div className="space-y-2">
            <label htmlFor="imageFile" className="text-sm font-medium">Upload Image from Computer</label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">OR</span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">Provide Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={product.imageUrl}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Provide a direct URL or Google Images link. (File upload takes priority if both are provided)</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
