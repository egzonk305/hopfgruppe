import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/app/products/_components/product-form'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Link
        href="/products"
        className="text-sm text-muted-foreground hover:underline mb-6 inline-block"
      >
        ← Zurück zur Übersicht
      </Link>

      <h1 className="text-2xl font-bold mb-8">Neues Produkt</h1>

      <ProductForm categories={categories} />
    </main>
  )
}
