"use client"

import { AlertCircle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-950">
      <Card className="mx-auto max-w-xl border-red-200 bg-red-50 text-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" aria-hidden="true" />
            Dashboard konnte nicht geladen werden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-900">
            {error.message || "Bitte pruefe die Datenbank-Verbindung."}
          </p>
          <Button type="button" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Erneut versuchen
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
