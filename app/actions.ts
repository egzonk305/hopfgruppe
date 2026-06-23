"use server"

import { prisma } from "@/lib/prisma"
import {
  DashboardLookupSchema,
  type DashboardLookupInput,
} from "@/schemas/dashboard"

export async function getUserDashboard(input: DashboardLookupInput) {
  const { email } = DashboardLookupSchema.parse(input)

  return prisma.user.findUnique({
    where: { email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  })
}
