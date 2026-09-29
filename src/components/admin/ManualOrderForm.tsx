"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createManualOrder } from "@/app/actions/orders";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  price: number;
};

export function ManualOrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ productId: "", productName: "", quantity: 1, unitPrice: 0 }]);

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: product.id,
      productName: product.title,
      unitPrice: product.price,
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  const handlePriceChange = (index: number, price: number) => {
    const newItems = [...items];
    newItems[index].unitPrice = price;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: "", productName: "", quantity: 1, unitPrice: 0 }]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);

  const total = subtotal + tax + shipping - discount;

  async function onSubmit(formData: FormData) {
    if (items.some((item) => !item.productId)) {
      toast.error("Please select a product for all items.");
      return;
    }

    try {
      setLoading(true);
      formData.append("orderItems", JSON.stringify(items));
      formData.append("subtotal", subtotal.toString());
      formData.append("taxAmount", tax.toString());
      formData.append("shippingCost", shipping.toString());
      formData.append("discountAmount", discount.toString());
      formData.append("total", total.toString());

      await createManualOrder(formData);
      toast.success("Order created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>Enter the customer's information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Name *</Label>
              <Input id="customerName" name="customerName" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" name="customerEmail" type="email" placeholder="john@example.com (Optional)" />
              <p className="text-xs text-muted-foreground">If left empty, a placeholder email will be used.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone</Label>
              <Input id="customerPhone" name="customerPhone" placeholder="+1 234 567 890" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Set the date and additional costs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <Input id="orderDate" name="orderDate" type="datetime-local" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax Amount</Label>
                <Input id="taxAmount" type="number" step="0.01" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Shipping Cost</Label>
                <Input id="shippingCost" type="number" step="0.01" value={shipping} onChange={(e) => setShipping(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountAmount">Discount</Label>
                <Input id="discountAmount" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Add items to this order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-muted/50 p-4 rounded-lg">
              <div className="flex-1 space-y-2 w-full">
                <Label>Product</Label>
                <Select value={item.productId} onValueChange={(val) => val && handleProductChange(index, val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title} - ${p.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-24 space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="w-full sm:w-24 space-y-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                />
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} disabled={items.length === 1}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addItem} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>

          <div className="border-t pt-4 mt-6 flex flex-col items-end space-y-2">
            <div className="flex justify-between w-full max-w-xs text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {(tax > 0 || shipping > 0 || discount > 0) && (
              <>
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>+${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>+${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-sm">
                  <span className="text-muted-foreground">Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between w-full max-w-xs font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/orders")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Order"}
        </Button>
      </div>
    </form>
  );
}
