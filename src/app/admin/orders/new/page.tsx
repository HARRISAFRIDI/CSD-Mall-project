import { prisma } from "@/lib/prisma";
import { ManualOrderForm } from "@/components/admin/ManualOrderForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "New Manual Order | Admin",
};

export default async function NewManualOrderPage() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      title: true,
      price: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Manual Order</h2>
          <p className="text-muted-foreground">Add a new offline or phone order manually.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/orders">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <ManualOrderForm products={products} />
      </div>
    </div>
  );
}
