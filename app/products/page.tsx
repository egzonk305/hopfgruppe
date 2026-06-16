import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function ProductsPage() {
  // Alle Produkte aus der Datenbank holen, inkl. Kategoriename
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Produkte</h1>
        <Link
          href="/products/new"
          className="bg-foreground text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Neues Produkt
        </Link>
      </div>

      {products.length === 0 && (
        <p className="text-muted-foreground">Keine Produkte gefunden.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-2"
          >
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category.name}
            </span>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
            <p className="text-xl font-bold mt-auto">
              {product.price.toFixed(2)} €
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
