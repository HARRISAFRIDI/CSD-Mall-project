import { prisma } from "@/lib/prisma";
import { Save } from "lucide-react";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = { title: "Settings" };

async function saveSettings(formData: FormData) {
  "use server";
  
  const storeName = formData.get("storeName") as string;
  const taxRate = parseFloat(formData.get("taxRate") as string) / 100;
  
  const setting = await prisma.storeSetting.findUnique({ where: { key: "store_config" } });
  if (setting) {
    const config = JSON.parse(setting.value);
    config.storeName = storeName;
    config.taxRate = taxRate;
    await prisma.storeSetting.update({
      where: { key: "store_config" },
      data: { value: JSON.stringify(config) },
    });
  }
  
  revalidatePath("/admin/settings");
}

export default async function SettingsPage() {
  const setting = await prisma.storeSetting.findUnique({
    where: { key: "store_config" },
  });
  
  const config = setting ? JSON.parse(setting.value) : { storeName: "CSD", taxRate: 0.08 };

  return (
    <div className="p-6 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store's configuration and preferences.</p>
      </div>

      <form action={saveSettings} className="space-y-8">
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-foreground">General Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="storeName" className="text-sm font-medium">Store Name</label>
              <input
                id="storeName"
                name="storeName"
                defaultValue={config.storeName}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</label>
              <input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                defaultValue={(config.taxRate * 100).toFixed(2)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Shipping Zones</h2>
          <div className="space-y-4">
            {config.shippingZones?.map((sz: any) => (
              <div key={sz.id} className="flex items-center justify-between p-4 border border-border/30 rounded-lg bg-muted/10">
                <div>
                  <p className="font-medium text-foreground">{sz.region}</p>
                </div>
                <div className="font-semibold text-primary">${parseFloat(sz.cost).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Promo Codes</h2>
          <div className="space-y-4">
            {config.promoCodes?.map((pc: any) => (
              <div key={pc.id} className="flex items-center justify-between p-4 border border-border/30 rounded-lg bg-muted/10">
                <div className="flex items-center gap-3">
                  <p className="font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-md">{pc.code}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {pc.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="font-semibold text-foreground">{pc.discountPercent}% OFF</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
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
