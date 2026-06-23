'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { CreateProductSchema, type CreateProductInput } from '@/lib/schemas/product'
import { createProduct } from '@/app/products/actions'

interface Props {
  categories: { id: string; name: string }[]
}

export default function ProductForm({ categories }: Props) {
  const router = useRouter()

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
    },
  })

  async function onSubmit(data: CreateProductInput) {
    try {
      await createProduct(data)
      toast.success('Produkt erstellt', {
        description: `"${data.name}" wurde erfolgreich angelegt.`,
      })
      router.push('/products')
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler'
      toast.error('Produkt konnte nicht erstellt werden', { description: message })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Name</label>
        <input
          {...form.register('name')}
          placeholder="z.B. Classic T-Shirt"
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Beschreibung (optional)</label>
        <textarea
          {...form.register('description')}
          placeholder="Kurze Produktbeschreibung..."
          rows={3}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Preis (€)</label>
          <input
            type="number"
            step="0.01"
            {...form.register('price', { valueAsNumber: true })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Lagerbestand</label>
          <input
            type="number"
            {...form.register('stock', { valueAsNumber: true })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {form.formState.errors.stock && (
            <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">{form.formState.errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Kategorie</label>
        <select
          {...form.register('categoryId')}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
        >
          <option value="">Bitte wählen...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {form.formState.errors.categoryId && (
          <p className="text-sm text-red-500 animate-in fade-in slide-in-from-top-1">{form.formState.errors.categoryId.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="bg-foreground text-background rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {form.formState.isSubmitting ? 'Wird gespeichert...' : 'Produkt erstellen'}
      </button>
    </form>
  )
}
