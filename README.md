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

## Protokollarkiv (kommunfullmäktige m.fl.)

Lomma kommuns egen sida ["Kallelser, handlingar och protokoll"](https://lomma.se/kommunochpolitik/politikochdemokrati/kallelserhandlingarochprotokoll.1338.html)
ser tom ut vid en vanlig sidhämtning &mdash; hela dokumentarkivet ligger inbäddat i en `<iframe>` till en
tredjepartstjänst, **NetPublicator**, som inte syns om man bara hämtar/parsar sidans HTML eller
tillgänglighetsträd. Den riktiga arkiv-URL:en är:

```
https://www.netpublicator.com/reader/r01696490
```

Där finns mappar per organ (Kommunfullmäktige, Kommunstyrelsen, Barn- och utbildningsnämnden,
Kultur- och fritidsnämnden, Samhällsbyggnadsnämnden, Socialnämnden, Författningssamling, Protokoll -
Kommunala råd) och under varje mapp en lista av sammanträdesdatum 2022&ndash;2026, som i sin tur länkar
till kallelser och fullständiga protokoll (inklusive bilagda voteringsprotokoll och skriftliga
reservationer) som PDF:er via `docs.netpublicator.com` &mdash; helt utan inloggning. Miljö- och
byggnadsnämnden är undantaget: den kanalen anger istället att handlingar begärs ut via
miljo-byggnadsnamnd@lomma.se.

Detta är den primära källan för riktig röstningsdata (`hur man röstat i olika frågor`), inte bara
nyhetssammanfattningar. Ett fullständigt exempel finns redan inarbetat: kommunfullmäktiges möte
2025-10-16 (§ 76&ndash;77) om att stänga Strandskolan och Löddesnässkolan, med exakta röstsiffror
(23&ndash;22 i båda ärendena) och namngivna voteringslistor, se `data/seed/news.json`. Vill du gräva
djupare i fler ärenden: gå till arkivet ovan, hitta rätt möte, ladda ner "Protokoll ... med bilagor" och
läs in det &mdash; för hand, som med all annan data i det här projektet.

## Kända begränsningar i v1

- **Ingen automatisk ingestion till databasen.** Allt som visas i appen är hand-kuraterat i `data/seed/`.
  `scripts/fetch-sources.ts` kan hämta råmaterial från publika sidor (se ovan), men matar aldrig in det
  direkt &mdash; ett medvetet val för att undvika att felaktig eller missvisande skrapad text hamnar på
  sajten oövervakat.
- **Facebook-inlägg saknas.** `SocialPost`-modellen och `data/seed/social.json` finns förberedda, men inga
  poster har seedats ännu &mdash; exakta publiceringsdatum och engagemangssiffror gick inte att verifiera
  tillförlitligt via sökning i denna omgång och kräver manuell insamling (inloggad i Facebook).
- **Bara ett fullständigt genomläst protokoll hittills.** Protokollarkivet (se ovan) är stort &mdash; bara
  ett möte (2025-10-16) är hittills läst i sin helhet och inarbetat med exakta röstsiffror. Övriga
  nyhetsposter i `data/seed/news.json` bygger fortfarande på kommunens nyhetssammanfattningar, inte
  originalprotokoll.
- **En person utan parti.** En ledamot (Gun Larsson) sitter som politiskt oberoende i flera organ, utan
  partibeteckning i kommunens förtroendemannaregister. Hon har ingen egen partisida men syns i
  `/namnder`-listorna som "Oberoende" &mdash; och har visat sig ha en de facto vågmästarroll i minst två
  hårt omstridda voteringar (se ovan).
