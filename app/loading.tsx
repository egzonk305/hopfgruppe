import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-lg bg-stone-200" />
        <section className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardHeader>
                <div className="h-4 w-24 rounded bg-stone-200" />
                <div className="h-6 w-36 rounded bg-stone-200" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-44 rounded bg-stone-200" />
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  )
}
