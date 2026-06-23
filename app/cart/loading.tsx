import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl space-y-3">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full max-w-lg animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <CardHeader>
                <div className="h-5 w-36 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 rounded bg-muted" />
                <div className="h-8 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </section>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-4 w-40 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-32 rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
