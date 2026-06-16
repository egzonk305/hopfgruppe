import { z } from 'zod'

export const CreateProductSchema = z.object({
  name: z.string()
    .min(1, 'Name ist erforderlich')
    .max(100, 'Name darf maximal 100 Zeichen haben'),
  description: z.string().optional(),
  price: z.number()
    .positive('Preis muss größer als 0 sein'),
  stock: z.number()
    .int('Lagerbestand muss eine ganze Zahl sein')
    .min(0, 'Lagerbestand darf nicht negativ sein'),
  categoryId: z.string()
    .min(1, 'Kategorie ist erforderlich'),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
