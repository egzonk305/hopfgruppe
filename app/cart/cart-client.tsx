"use client";

import {
  AlertCircle,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { checkoutCart } from "@/app/cart/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckoutSchema, type CartItemInput } from "@/schemas/cart";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: {
    name: string;
  };
};

type CartLine = CartItemInput & {
  name: string;
  price: number;
  stock: number;
};

type CheckoutResult = {
  orderId: string;
  total: number;
  itemCount: number;
};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

function formatPrice(value: number) {
  return currencyFormatter.format(value);
}

export function CartClient({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"info" | "error" | "success">(
    "info"
  );
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  function addProduct(product: Product) {
    setResult(null);
    setMessage(null);
    setMessageTone("info");
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.stock, 20),
              }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setResult(null);
    setMessage(null);
    setMessageTone("info");
    setCart((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(Math.max(quantity, 1), item.stock, 20),
            }
          : item
      )
    );
  }

  function removeProduct(productId: string) {
    setResult(null);
    setMessage(null);
    setMessageTone("info");
    setCart((current) => current.filter((item) => item.productId !== productId));
  }

  function handleCheckout() {
    setResult(null);

    const payload = {
      items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
    };
    const validation = CheckoutSchema.safeParse(payload);

    if (!validation.success) {
      setMessage(validation.error.issues[0]?.message ?? "Warenkorb ungueltig.");
      setMessageTone("error");
      return;
    }

    startTransition(async () => {
      try {
        const checkoutResult = await checkoutCart(validation.data);

        setCart([]);
        setMessage("Bestellung wurde angelegt.");
        setMessageTone("success");
        setResult(checkoutResult);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Checkout konnte nicht abgeschlossen werden."
        );
        setMessageTone("error");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Produkte</h2>
          <p className="text-sm text-muted-foreground">
            Artikel aus dem Katalog in den Warenkorb legen.
          </p>
        </div>

        {products.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Keine Produkte vorhanden</CardTitle>
              <CardDescription>
                Seed-Daten fehlen noch oder die Datenbank ist leer.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.category.name}</CardDescription>
                  <CardAction className="font-medium">
                    {formatPrice(product.price)}
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="min-h-10 text-sm text-muted-foreground">
                    {product.description ?? "Keine Beschreibung vorhanden."}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {product.stock} verfuegbar
                    </span>
                    <Button
                      type="button"
                      onClick={() => addProduct(product)}
                      disabled={product.stock <= 0 || isPending}
                    >
                      <ShoppingCart />
                      Hinzufuegen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Warenkorb</CardTitle>
            <CardDescription>
              {cart.length === 0
                ? "Noch keine Artikel ausgewaehlt."
                : `${cart.length} verschiedene Artikel`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Dein Warenkorb ist aktuell leer.
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="grid gap-3 rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} pro Stueck
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeProduct(item.productId)}
                        aria-label={`${item.name} entfernen`}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <div className="grid grid-cols-[32px_1fr_32px] items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label={`${item.name} verringern`}
                      >
                        <Minus />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={Math.min(item.stock, 20)}
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(
                            item.productId,
                            Number(event.target.value)
                          )
                        }
                        aria-label={`Menge fuer ${item.name}`}
                        className="text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label={`${item.name} erhoehen`}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <span className="font-medium">Zwischensumme</span>
              <span className="text-lg font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>

            {message && (
              <p
                className={
                  messageTone === "error"
                    ? "flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"
                    : messageTone === "success"
                      ? "flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
                      : "flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground"
                }
              >
                {messageTone === "error" ? (
                  <AlertCircle
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                ) : messageTone === "success" ? (
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                ) : null}
                {message}
              </p>
            )}

            {result && (
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Bestellung #{result.orderId.slice(-6)}</p>
                <p className="text-muted-foreground">
                  {result.itemCount} Artikel fuer {formatPrice(result.total)}
                </p>
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              onClick={handleCheckout}
              disabled={cart.length === 0 || isPending}
            >
              <ShoppingCart />
              {isPending ? "Wird gespeichert..." : "Checkout starten"}
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
