import { CartClient } from "@/app/cart/cart-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          Person B Feature
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          Warenkorb
        </h1>
        <p className="mt-3 text-muted-foreground">
          Produkte auswaehlen, Mengen pruefen und eine Bestellung mit
          Zod-validiertem Checkout speichern.
        </p>
      </div>

      <CartClient products={products} />
    </main>
  );
}
