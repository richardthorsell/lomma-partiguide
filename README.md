# Lomma Partiguide

Sök och jämför de politiska partierna i Lomma kommun inför valet 2026.

## Kom igång

1. Installera beroenden:

   ```bash
   npm install
   ```

2. Skapa ett gratis [Neon](https://neon.tech)-projekt och kopiera dess connection string.
   Kopiera `.env.local.example` till `.env.local` och klistra in din `DATABASE_URL`.

3. Skapa databasschemat:

   ```bash
   npm run db:push
   ```

4. Ladda in researchad data (partier, mandat, sakfrågor, nyheter):

   ```bash
   npm run db:seed
   ```

5. Starta utvecklingsservern:

   ```bash
   npm run dev
   ```

   Öppna [http://localhost:3000](http://localhost:3000). `/partier` ska visa åtta partikort hämtade från databasen.

## Redigera data

Allt innehåll (partier, sakfrågor, nyheter) ligger i `data/seed/` som JSON-filer. Redigera filerna och kör
`npm run db:seed` igen — det är säkert att köra om (idempotent, uppdaterar via `upsert`).

- `data/seed/parties/*.json` &mdash; ett parti per fil
- `data/seed/issue-areas.json` &mdash; sakfrågeområden
- `data/seed/election-periods.json` &mdash; valperioder
- `data/seed/news.json` &mdash; nyhetsartiklar, kopplade till partier via `partySlugs`
- `data/seed/social.json` &mdash; Facebook-inlägg (tomt i v1, se nedan)

## Hämta mer källmaterial

För att bredda underlaget finns `scripts/fetch-sources.ts` &mdash; den hämtar partiernas webbplatser och
Lomma kommuns nyhetsarkiv (endast publika sidor, respekterar `robots.txt`, aldrig Facebook eller annat som
kräver inloggning) och sparar rå text i `data/sources/` för manuell genomläsning. Den skriver **aldrig**
direkt till `data/seed/` eller databasen &mdash; du (eller jag) läser igenom och för in det som är relevant
för hand, precis som i den ursprungliga researchen.

Eftersom detta kräver Node kan du antingen köra det lokalt:

```bash
npm run fetch:sources
```

...eller, om Node är blockerat på din dator, trigga workflowen **Fetch source material** under fliken
**Actions** på GitHub (`workflow_dispatch`) &mdash; den kör scriptet i molnet och committar resultatet i
`data/sources/` automatiskt.

## Kända begränsningar i v1

- **Ingen automatisk ingestion till databasen.** Allt som visas i appen är hand-kuraterat i `data/seed/`.
  `scripts/fetch-sources.ts` kan hämta råmaterial från publika sidor (se ovan), men matar aldrig in det
  direkt &mdash; ett medvetet val för att undvika att felaktig eller missvisande skrapad text hamnar på
  sajten oövervakat.
- **Facebook-inlägg saknas.** `SocialPost`-modellen och `data/seed/social.json` finns förberedda, men inga
  poster har seedats ännu &mdash; exakta publiceringsdatum och engagemangssiffror gick inte att verifiera
  tillförlitligt via sökning i denna omgång och kräver manuell insamling (inloggad i Facebook).
- **Ofullständiga sakfrågor för vissa partier.** Fokus Bjärred, Centerpartiet och Kristdemokraterna hade
  begränsat tillgängligt lokalt källmaterial vid research-tillfället; detta är flaggat direkt i respektive
  partis JSON-fil (`details`-fältet) och bör kompletteras.
- **Ingen produktionsdeploy.** Appen är byggd för att kunna deployas till t.ex. Vercel, men själva
  Vercel-uppsättningen (projekt, env-variabler, domän) är inte gjord.
