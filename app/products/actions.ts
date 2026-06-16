'use server'

import { prisma } from '@/lib/prisma'
import { CreateProductSchema } from '@/lib/schemas/product'

export async function createProduct(formData: unknown) {
  // Server-seitige Validierung – läuft IMMER, egal was vom Client kommt
  const validated = CreateProductSchema.parse(formData)

  const product = await prisma.product.create({
    data: validated,
  })

  return product
}
