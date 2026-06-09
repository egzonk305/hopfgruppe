import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Kategorien
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'shirts' },
      update: {},
      create: { name: 'Shirts', slug: 'shirts' },
    }),
    prisma.category.upsert({
      where: { slug: 'hosen' },
      update: {},
      create: { name: 'Hosen', slug: 'hosen' },
    }),
    prisma.category.upsert({
      where: { slug: 'accessoires' },
      update: {},
      create: { name: 'Accessoires', slug: 'accessoires' },
    }),
  ])

  const [shirts, hosen, accessoires] = categories

  // Produkte
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod_1' },
      update: {},
      create: {
        id: 'prod_1',
        name: 'Classic T-Shirt',
        description: 'Ein zeitloses T-Shirt aus 100% Baumwolle.',
        price: 29.99,
        stock: 50,
        imageUrl: 'https://placehold.co/400x400?text=T-Shirt',
        categoryId: shirts.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_2' },
      update: {},
      create: {
        id: 'prod_2',
        name: 'Slim Fit Jeans',
        description: 'Moderne Slim-Fit Jeans in Dunkelblau.',
        price: 79.99,
        stock: 30,
        imageUrl: 'https://placehold.co/400x400?text=Jeans',
        categoryId: hosen.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_3' },
      update: {},
      create: {
        id: 'prod_3',
        name: 'Cargo Hose',
        description: 'Praktische Cargo Hose mit vielen Taschen.',
        price: 59.99,
        stock: 20,
        imageUrl: 'https://placehold.co/400x400?text=Cargo',
        categoryId: hosen.id,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod_4' },
      update: {},
      create: {
        id: 'prod_4',
        name: 'Snapback Cap',
        description: 'Verstellbare Cap im Street-Style.',
        price: 24.99,
        stock: 100,
        imageUrl: 'https://placehold.co/400x400?text=Cap',
        categoryId: accessoires.id,
      },
    }),
  ])

  // Test-User mit einer Beispielbestellung
  const user = await prisma.user.upsert({
    where: { email: 'benstr71@gmail.com' },
    update: {},
    create: {
      email: 'benstr71@gmail.com',
      name: 'Bendit',
      orders: {
        create: {
          status: 'paid',
          total: 109.98,
          items: {
            create: [
              { productId: products[0].id, quantity: 2, price: 29.99 },
              { productId: products[1].id, quantity: 1, price: 79.99 },
            ],
          },
        },
      },
    },
  })

  console.log(`Seed: ${products.length} Produkte, ${categories.length} Kategorien, User ${user.email}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
