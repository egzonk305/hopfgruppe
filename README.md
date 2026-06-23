# Hopfgruppe Shop

Full-Stack-Gruppenprojekt fuer Praktikum 9/10: ein kleiner Shop-Prototyp mit
Produktdaten, Benutzerprofilen und Bestellhistorie.

## Tech Stack

- Next.js mit App Router und TypeScript
- Prisma mit LibSQL/Turso und lokaler SQLite-kompatibler Entwicklung
- Tailwind CSS und shadcn/ui
- Zod fuer Laufzeitvalidierung
- Next.js Caching mit Revalidation nach Mutationen

## Getting Started

Lege lokal eine `.env.local` oder `.env` mit der Datenbank-URL an:

```bash
DATABASE_URL="file:./prisma/dev.db"
DATABASE_AUTH_TOKEN=""
```

Dann das Projekt vorbereiten und starten:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Feature-Aufteilung

- Person A: Produktkatalog mit Prisma-Modellen, Liste und Detaildaten
- Person B: Warenkorb mit State-Management, UI und spaeteren Server Actions
- Person C: Benutzer-Dashboard mit Profil, Bestellhistorie und Zod-validierter Suche

## Praktikum-9-Status

- Next.js-, Prisma-, Tailwind- und shadcn/ui-Scaffold vorhanden
- Prisma-Schema, Migration und Seed-Daten vorhanden
- Person-C-Feature auf Branch `feature-user-dashboard` begonnen
- Zod-Schema fuer Dashboard-Eingaben vorhanden
- PR/Review-Schritte muessen nach dem Push auf GitHub/GitLab erledigt werden

## Nuetzliche Befehle

```bash
npm run dev
npm run lint
npm run build
npm run db:migrate
npm run db:deploy
npm run db:seed
```

Der Seed legt den Beispielnutzer `benstr71@gmail.com` mit einer Bestellung an.

## Praktikum-10-Status

- Caching fuer das Benutzer-Dashboard ist aktiviert (`revalidate = 60`).
- Checkout-Mutationen invalidieren `/`, `/cart` und den Dashboard-Cache.
- Der Warenkorb nutzt Revalidation (`revalidate = 60`) und wird nach Checkout-Mutationen invalidiert.
- Loading-, Error- und Empty-States sind fuer Dashboard und Warenkorb umgesetzt.
- Open-Graph-Metadaten sind im Root-Layout hinterlegt.
- `.env.local`/Vercel Environment Variables werden fuer `DATABASE_URL` und `DATABASE_AUTH_TOKEN` genutzt und nicht committed.

## Deployment auf Vercel

1. Repository auf Vercel importieren.
2. In Vercel `DATABASE_URL` und `DATABASE_AUTH_TOKEN` unter Settings -> Environment Variables setzen.
3. Build Command bei Standard `npm run build` lassen.
4. Einmalig lokal gegen Turso die Migration und Seed-Daten ausfuehren:

```bash
DATABASE_URL="libsql://DEINE-DATENBANK.turso.io" DATABASE_AUTH_TOKEN="dein-turso-auth-token" npm run db:deploy
DATABASE_URL="libsql://DEINE-DATENBANK.turso.io" DATABASE_AUTH_TOKEN="dein-turso-auth-token" npm run db:seed
```

5. Nach jedem Push auf `main` wird automatisch deployed; Pull Requests erhalten Preview-Deployments.

SQLite-Dateien sind fuer Vercel Serverless nicht persistent. Fuer Praktikum 10 ist Turso
vorgesehen:

```bash
DATABASE_URL="libsql://DEINE-DATENBANK.turso.io"
DATABASE_AUTH_TOKEN="dein-turso-auth-token"
```

Das Prisma-Schema bleibt mit Provider `sqlite` kompatibel; die App nutzt zur Laufzeit den
Prisma-LibSQL-Adapter fuer Turso. In Production gibt es keinen SQLite-Fallback: fehlt
`DATABASE_URL`, bricht die App bewusst mit einer klaren Fehlermeldung ab.

## Lighthouse-Check

Nach dem Vercel-Deployment Chrome DevTools -> Lighthouse -> Mobile -> Performance ausfuehren.
Zielwert aus dem Praktikum: mindestens 80. Die groessten drei Findings danach im PR dokumentieren
und beheben.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
