import { z } from "zod"

export const DEFAULT_DASHBOARD_EMAIL = "benstr71@gmail.com"

export const DashboardLookupSchema = z.object({
  email: z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return DEFAULT_DASHBOARD_EMAIL
      }

      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : DEFAULT_DASHBOARD_EMAIL
    },
    z
      .string()
      .email("Bitte gib eine gueltige E-Mail-Adresse ein.")
      .max(120, "Die E-Mail-Adresse ist zu lang.")
  ),
})

export type DashboardLookupInput = z.infer<typeof DashboardLookupSchema>
