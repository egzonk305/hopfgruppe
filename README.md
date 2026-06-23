# Hopfgruppe Shop

Full-Stack-Gruppenprojekt fuer Praktikum 9/10: ein kleiner Shop-Prototyp mit
Produktdaten, Benutzerprofilen und Bestellhistorie.

## Tech Stack

- Next.js mit App Router und TypeScript
- Prisma mit SQLite
- Tailwind CSS und shadcn/ui
- Zod fuer Laufzeitvalidierung

## Getting Started

Lege lokal eine `.env` mit der Datenbank-URL an:

```bash
DATABASE_URL="file:./prisma/dev.db"
```

Dann das Projekt vorbereiten und starten:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
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
```

Der Seed legt den Beispielnutzer `benstr71@gmail.com` mit einer Bestellung an.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
