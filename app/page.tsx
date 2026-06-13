import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">
          Gruppenprojekt Praktikum 9
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          E-Commerce Shop
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Der aktuell implementierte Beitrag ist Person Bs Warenkorb mit
          State-Management, UI und serverseitigem Checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/cart">Zum Warenkorb</Link>
        </Button>
      </div>
    </main>
  );
}
