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

**Obs:** `npm run build` (och därmed varje Vercel-deploy) kör `prisma db push --force-reset`, vilket
nollställer och återskapar hela databasschemat från `schema.prisma` innan det seedas om från JSON-filerna.
Databasen är med andra ord helt engångsbar &mdash; `data/seed/` är den enda källan till sanning. Gör aldrig
manuella ändringar direkt i databasen (t.ex. via Prisma Studio) och förvänta dig att de består.

- `data/seed/parties/*.json` &mdash; ett parti per fil
- `data/seed/issue-areas.json` &mdash; sakfrågeområden
- `data/seed/election-periods.json` &mdash; valperioder
- `data/seed/news.json` &mdash; nyhetsartiklar, kopplade till partier via `partySlugs`
- `data/seed/social.json` &mdash; Facebook-inlägg (tomt i v1, se nedan)
- `data/seed/people.json` &mdash; namnkunniga företrädare med bio/kontaktuppgifter (visas på partisidorna).
  Övriga förtroendevalda skapas automatiskt utifrån `committees.json` och behöver inte läggas till här.
- `data/seed/committees.json` &mdash; kommunfullmäktige, kommunstyrelsen, kommunstyrelsens arbetsutskott och
  kommunens sex nämnder, med fullständig sammansättning (namn, parti, roll) hämtad från kommunens officiella
  förtroendemannaregister (`lomma.tromanpublik.se`). Driver `/namnder`-sidorna.

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
- **Inga enskilda omröstningsresultat.** `/namnder` visar vem som sitter var, men inte hur enskilda
  ledamöter röstat i specifika ärenden &mdash; den informationen finns bara i kommunfullmäktiges protokoll
  som PDF:er per möte och är inte systematiskt sammanställd här ännu.
- **En person utan parti.** En ledamot (Gun Larsson) sitter som politiskt oberoende i flera organ efter att
  ha lämnat sitt ursprungliga parti; hon har ingen egen partisida men syns i `/namnder`-listorna som
  "Oberoende".
