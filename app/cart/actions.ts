"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CheckoutSchema, type CheckoutInput } from "@/schemas/cart";

const CART_USER = {
  email: "person-b@example.com",
  name: "Person B",
};

export async function checkoutCart(input: CheckoutInput) {
  const validated = CheckoutSchema.parse(input);
  const productIds = validated.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const productsById = new Map(products.map((product) => [product.id, product]));

  const orderItems = validated.items.map((item) => {
    const product = productsById.get(item.productId);

    if (!product) {
      throw new Error("Ein Produkt aus dem Warenkorb existiert nicht mehr.");
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} ist nicht mehr in dieser Menge verfuegbar.`);
    }

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: CART_USER.email },
      update: { name: CART_USER.name },
      create: CART_USER,
    });

    const createdOrder = await tx.order.create({
      data: {
        userId: user.id,
        status: "pending",
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    await Promise.all(
      orderItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

    return createdOrder;
  });

  // Produktbestände haben sich geändert – Produktseiten neu validieren
  revalidatePath("/products");
  revalidatePath("/products/[id]", "page");

  return {
    orderId: order.id,
    total,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
