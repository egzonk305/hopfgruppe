import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '../../generated/prisma/client'

const SORT_OPTIONS = {
  newest: { createdAt: 'desc' },
  'price-asc': { price: 'asc' },
  'price-desc': { price: 'desc' },
  'name-asc': { name: 'asc' },
} satisfies Record<string, Prisma.ProductOrderByWithRelationInput>

type SortKey = keyof typeof SORT_OPTIONS

function isSortKey(value: string): value is SortKey {
  return value in SORT_OPTIONS
}

interface Props {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { q = '', category = '', sort = 'newest' } = await searchParams
  const sortKey: SortKey = isSortKey(sort) ? sort : 'newest'

  const where: Prisma.ProductWhereInput = {
    ...(q && { name: { contains: q } }),
    ...(category && { categoryId: category }),
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: SORT_OPTIONS[sortKey],
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const hasActiveFilters = q !== '' || category !== ''

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

      <form className="flex flex-wrap items-end gap-3 mb-8" action="/products">
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label htmlFor="q" className="text-sm font-medium">Suche</label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Produktname..."
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium">Kategorie</label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="sort" className="text-sm font-medium">Sortierung</label>
          <select
            id="sort"
            name="sort"
            defaultValue={sortKey}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="price-asc">Preis aufsteigend</option>
            <option value="price-desc">Preis absteigend</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </div>

        <button
          type="submit"
          className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          Filtern
        </button>

        {hasActiveFilters && (
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:underline px-1 py-2"
          >
            Filter zurücksetzen
          </Link>
        )}
      </form>

      {products.length === 0 && (
        <p className="text-muted-foreground animate-in fade-in">
          {hasActiveFilters
            ? 'Keine Produkte für diese Filter gefunden.'
            : 'Keine Produkte gefunden.'}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            className="border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
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
