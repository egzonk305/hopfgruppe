# Praktikum 10 Status

Diese Datei dokumentiert, was fuer Praktikum 10 im Projekt umgesetzt wurde.

## 10.1 Deployment auf Vercel

- Projekt ist fuer Vercel vorbereitet.
- `vercel.json` ist vorhanden.
- Build Command ist auf `npm run build` gesetzt.
- Install Command ist auf `npm ci` gesetzt.
- `npm run build` fuehrt automatisch `prisma generate` aus, damit der generierte Prisma Client auch auf Vercel vorhanden ist.

Wichtige Dateien:

- `vercel.json`
- `package.json`
- `.env.example`
- `README.md`

## 10.2 Datenbank-Migration zu Turso

Entscheidung: Turso / LibSQL.

Umgesetzt:

- Prisma Runtime nutzt den LibSQL-Adapter.
- Alte `better-sqlite3`-Adapter-Pakete wurden entfernt.
- Neue Pakete:
  - `@libsql/client`
  - `@prisma/adapter-libsql`
- `DATABASE_URL` und `DATABASE_AUTH_TOKEN` sind fuer Turso vorgesehen.
- Lokal bleibt ein SQLite-kompatibler Fallback fuer Entwicklung moeglich.
- Auf Vercel gibt es keinen stillen SQLite-Fallback: fehlt `DATABASE_URL`, wird eine klare Fehlermeldung geworfen.

Vercel Environment Variables:

```bash
DATABASE_URL="libsql://DEINE-DATENBANK.turso.io"
DATABASE_AUTH_TOKEN="dein-turso-auth-token"
```

Einmalig gegen Turso ausfuehren:

```bash
DATABASE_URL="libsql://DEINE-DATENBANK.turso.io" DATABASE_AUTH_TOKEN="dein-turso-auth-token" npm run db:deploy
DATABASE_URL="libsql://DEINE-DATENBANK.turso.io" DATABASE_AUTH_TOKEN="dein-turso-auth-token" npm run db:seed
```

Wichtige Dateien:

- `lib/prisma.ts`
- `prisma/seed.ts`
- `prisma.config.ts`
- `package.json`
- `.env.example`

## 10.3 Caching implementiert

Umgesetzt:

- Dashboard nutzt `revalidate = 60`.
- Warenkorb nutzt ebenfalls `revalidate = 60`.
- Checkout invalidiert relevante Caches:
  - `/`
  - `/cart`
  - Dashboard-Cache per `revalidateTag("user-dashboard", "max")`
- Dashboard-Abfrage nutzt `unstable_cache` mit Tag `user-dashboard`.

Wichtige Dateien:

- `app/actions.ts`
- `app/page.tsx`
- `app/cart/page.tsx`
- `app/cart/actions.ts`

## 10.4 Performance / Lighthouse-Vorbereitung

Umgesetzt:

- Next.js Production Build ist erfolgreich.
- Unnoetige Runtime-Fehler im Dashboard wurden behoben.
- Root Metadata / Open Graph Metadata sind vorhanden.
- Seiten sind serverseitig gerendert bzw. revalidierbar, statt unnoetig voll dynamisch.

Geprueft:

```bash
npm run lint
npm run build
```

Beides laeuft erfolgreich.

Wichtige Dateien:

- `app/layout.tsx`
- `app/page.tsx`
- `app/cart/page.tsx`

## 10.5 Polish umgesetzt

Nach Vorgabe wurde nur Polish umgesetzt, keine neue Suche/Filter/Sortierung.

Umgesetzt:

- Loading-State fuer Dashboard.
- Error-State fuer Dashboard.
- Loading-State fuer Warenkorb.
- Error-State fuer Warenkorb.
- Empty-State fuer leeren Produktkatalog.
- Empty-State fuer leeren Warenkorb.
- Success-Feedback nach Checkout.
- Error-Feedback bei Checkout-Problemen.
- Dashboard-Datumsformatierung ist Turso/LibSQL-robust.

Wichtige Dateien:

- `app/loading.tsx`
- `app/error.tsx`
- `app/cart/loading.tsx`
- `app/cart/error.tsx`
- `app/cart/cart-client.tsx`
- `app/page.tsx`

## Lokaler Start

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Lokale URL:

```text
http://localhost:3000
```

## Nuetzliche Befehle

```bash
npm run dev
npm run lint
npm run build
npm run db:migrate
npm run db:deploy
npm run db:seed
```

## Letzter technischer Check

Zuletzt erfolgreich geprueft:

- `npm run lint`
- `npm run build`
- `npm run db:migrate`
- `npm run db:seed`
- `GET /`
- `GET /cart`

Beide Seiten antworten lokal mit `200 OK`.
