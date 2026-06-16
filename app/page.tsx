import Link from "next/link"
import {
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  PackageCheck,
  Search,
  ShoppingBag,
  UsersRound,
} from "lucide-react"

import { getUserDashboard } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DashboardLookupSchema,
  DEFAULT_DASHBOARD_EMAIL,
} from "@/schemas/dashboard"

type HomeProps = {
  searchParams?: Promise<{
    email?: string
  }>
}

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
})

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const lookup = DashboardLookupSchema.safeParse({
    email: params?.email,
  })
  const email = lookup.success ? lookup.data.email : DEFAULT_DASHBOARD_EMAIL
  const user = lookup.success ? await getUserDashboard({ email }) : null

  const orderCount = user?.orders.length ?? 0
  const itemCount =
    user?.orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    ) ?? 0
  const totalSpent =
    user?.orders.reduce((sum, order) => sum + order.total, 0) ?? 0

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">
              <UsersRound className="size-4" aria-hidden="true" />
              Person C Feature
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-normal text-stone-950 sm:text-4xl">
                Benutzer-Dashboard
              </h1>
              <p className="max-w-2xl text-base leading-7 text-stone-600">
                Profiluebersicht, Bestellhistorie und ein validiertes Suchfeld
                fuer den gemeinsamen Shop-Prototyp.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:max-w-md">
            <Button asChild variant="outline" className="h-10 w-full">
              <Link href="/cart">
                <ShoppingBag className="size-4" aria-hidden="true" />
                Zum Warenkorb
              </Link>
            </Button>
            <form className="flex flex-col gap-2 sm:flex-row" action="/">
              <label className="sr-only" htmlFor="email">
                E-Mail-Adresse
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                placeholder="kunde@example.com"
                required
                aria-invalid={!lookup.success}
                className="h-10 bg-white"
              />
              <Button className="h-10" type="submit">
                <Search className="size-4" aria-hidden="true" />
                Suchen
              </Button>
            </form>
          </div>
        </header>

        {!lookup.success ? (
          <Card className="border-red-200 bg-red-50 text-red-950 ring-red-100">
            <CardHeader>
              <CardTitle>Validierung fehlgeschlagen</CardTitle>
              <CardDescription className="text-red-800">
                {lookup.error.issues[0]?.message}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {lookup.success && !user ? (
          <Card>
            <CardHeader>
              <CardTitle>Kein Benutzer gefunden</CardTitle>
              <CardDescription>
                Fuer {email} gibt es noch kein Profil in den Seed-Daten.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {user ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardDescription>Profil</CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <CircleUserRound className="size-5 text-emerald-700" />
                    {user.name ?? "Unbenannter Kunde"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-stone-600">
                  {user.email}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>Bestellungen</CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="size-5 text-sky-700" />
                    {orderCount}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-stone-600">
                  {itemCount} Artikel insgesamt
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardDescription>Umsatz</CardDescription>
                  <CardTitle className="flex items-center gap-2">
                    <PackageCheck className="size-5 text-amber-700" />
                    {currencyFormatter.format(totalSpent)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-stone-600">
                  Aus abgeschlossenen Beispielkaeufen
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-normal">
                    Bestellhistorie
                  </h2>
                  <p className="text-sm text-stone-600">
                    Erste lauffaehige Ausbaustufe fuer Feature 3 aus Aufgabe 9.3.
                  </p>
                </div>

                {user.orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="border-b">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle>
                            Bestellung {order.id.slice(0, 8)}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <CalendarDays className="size-4" />
                            {dateFormatter.format(order.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">
                          <CheckCircle2 className="size-4" />
                          {order.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid gap-2 border-b border-stone-100 pb-3 last:border-0 last:pb-0 sm:grid-cols-[1fr_auto]"
                        >
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-stone-600">
                              {item.product.category.name} · Menge{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {currencyFormatter.format(
                              item.price * item.quantity
                            )}
                          </p>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 text-base font-semibold">
                        <span>Summe</span>
                        <span>{currencyFormatter.format(order.total)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <aside className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Person-C Scope</CardTitle>
                    <CardDescription>
                      Status fuer den Praktikumsabgleich
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "Feature-Branch angelegt",
                      "Dashboard-UI mit shadcn/ui",
                      "Zod-Validierung fuer Eingaben",
                      "Serverseitige Prisma-Abfrage",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-700" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            </section>
          </>
        ) : null}
      </div>
    </main>
  )
}
