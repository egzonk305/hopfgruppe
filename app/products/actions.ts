'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { CreateProductSchema } from '@/lib/schemas/product'

export async function createProduct(formData: unknown) {
  try {
    const validated = CreateProductSchema.parse(formData)

    const product = await prisma.product.create({
      data: validated,
    })

    // Cache für Produktliste invalidieren – neue Produkte erscheinen sofort
    revalidatePath('/products')

    return product
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.issues[0]?.message ?? 'Ungültige Eingabe')
    }

    // Unerwartete Fehler (z.B. DB-Fehler) nicht an den Client durchreichen –
    // könnten interne Details (Constraint-/Tabellennamen, Connection-Infos) enthalten
    console.error('createProduct fehlgeschlagen:', error)
    throw new Error('Produkt konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.')
  }
}
