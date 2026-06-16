import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1, "Produkt fehlt"),
  quantity: z.coerce
    .number()
    .int("Die Menge muss eine ganze Zahl sein")
    .min(1, "Mindestens 1 Artikel")
    .max(20, "Maximal 20 Artikel pro Produkt"),
});

export const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Der Warenkorb ist leer"),
});

export type CartItemInput = z.infer<typeof CartItemSchema>;
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
