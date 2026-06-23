'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { CreateProductSchema } from '@/lib/schemas/product'

export async function createProduct(formData: unknown) {
  const parsed = CreateProductSchema.safeParse(formData)

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Ungültige Eingabe')
  }

  try {
    const product = await prisma.product.create({
      data: parsed.data,
    })

    // Cache für Produktliste invalidieren – neue Produkte erscheinen sofort
    revalidatePath('/products')

    return product
  } catch (error) {
    // Unerwartete Fehler (z.B. DB-Fehler) nicht an den Client durchreichen –
    // könnten interne Details (Constraint-/Tabellennamen, Connection-Infos) enthalten
    console.error('createProduct fehlgeschlagen:', error)
    throw new Error('Produkt konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.')
  }
}
