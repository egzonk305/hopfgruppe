"use server"

import { unstable_cache } from "next/cache"

import { prisma } from "@/lib/prisma"
import {
  DashboardLookupSchema,
  type DashboardLookupInput,
} from "@/schemas/dashboard"

const getCachedUserDashboard = unstable_cache(
  async (email: string) =>
    prisma.user.findUnique({
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
    }),
  ["user-dashboard"],
  {
    revalidate: 60,
    tags: ["user-dashboard"],
  }
)

export async function getUserDashboard(input: DashboardLookupInput) {
  const { email } = DashboardLookupSchema.parse(input)

  return getCachedUserDashboard(email)
}
