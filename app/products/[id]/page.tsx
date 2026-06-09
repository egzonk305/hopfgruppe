import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })

  // Produkt nicht gefunden → 404-Seite
  if (!product) notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/products"
        className="text-sm text-muted-foreground hover:underline mb-6 inline-block"
      >
        ← Zurück zur Übersicht
      </Link>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        {product.category.name}
      </span>

      <h1 className="text-3xl font-bold mt-1 mb-3">{product.name}</h1>

      {product.description && (
        <p className="text-muted-foreground mb-6">{product.description}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">{product.price.toFixed(2)} €</p>
        <p className="text-sm text-muted-foreground">
          {product.stock > 0 ? `${product.stock} auf Lager` : 'Ausverkauft'}
        </p>
      </div>
    </main>
  )
}
