'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { CreateProductSchema } from '@/lib/schemas/product'

export async function createProduct(formData: unknown) {
  const validated = CreateProductSchema.parse(formData)

  const product = await prisma.product.create({
    data: validated,
  })

  // Cache für Produktliste invalidieren – neue Produkte erscheinen sofort
  revalidatePath('/products')

  return product
}
