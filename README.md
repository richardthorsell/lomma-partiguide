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
nyhetssammanfattningar.

**Alla 40 kommunfullmäktigeprotokoll från 2022-01-27 till 2026-06-17 är nedladdade** i
`data/sources/protokoll-kf/` (både originalPDF och en textkonverterad `.txt`-version per möte — 2025-10-16
saknades ursprungligen i arkivet trots att den redan citerades som källa, upptäckt och åtgärdat vid en
fact-check-genomgång). Fjorton av dem har lästs i sin helhet och gett upphov till konkreta poster i
`data/seed/news.json` med exakta röstsiffror:

- 2023-09-28 (§ 94) &mdash; detaljplanen för gymnasieskola/kommunhus antogs, 24&ndash;20. Sandra Pilemalm
  (L) yrkade själv bifall tillsammans med M, C och KD &mdash; ett halvår innan hon för första gången bröt
  sig loss från Alliansen i skolfrågan
- 2024-03-14 (§ 32&ndash;35) &mdash; kommunfullmäktige röstade om att *tillåta* de två
  folkinitiativ-omröstningarna. M, C och KD (och till en början L) röstade för att blockera båda, men fick
  bara enkel majoritet (24&ndash;20 respektive 22&ndash;23) mot den kvalificerade två tredjedels majoritet
  som krävs enligt kommunallagen för att stoppa ett giltigt folkinitiativ. I den andra omröstningen bröt
  sig Sandra Pilemalm (L) loss och röstade med oppositionen &mdash; den tidigaste dokumenterade sprickan
  mellan L och Alliansen, fem månader före den tidigare kända brytningen i augusti 2024
- 2024-08-29 (§ 100&ndash;101) &mdash; de två folkomröstningarna hanterades; Sandra Pilemalms (L)
  tilläggsyrkande om skolfinansiering röstades ner 23&ndash;22 samma dag som Alliansen fortfarande var
  enig i grundbeslutet &mdash; det formella utträdet ur det styrande blocket kom något senare
- 2025-10-16 (§ 76&ndash;77) &mdash; besluten att stänga Strandskolan/Löddesnässkolan, båda 23&ndash;22
- 2025-11-13 (§ 88) &mdash; budget 2026, alla fem oppositionspartiers alternativbudgetar avslogs,
  skattesatsen fastställd 23&ndash;21
- 2026-04-09 (§ 34) &mdash; ett exempel på att oppositionen faktiskt vinner en votering (23&ndash;19) när
  den samlar sig
- 2026-05-07 (§ 50) &mdash; en votering slutade exakt lika (22&ndash;22) och avgjordes av ordförandens
  utslagsröst; Miljöpartiets reservation bekräftar uttryckligen att skolstängningsbeslutet "togs med
  minimal majoritet och tack vare en politisk vilde" (dvs. Gun Larsson)
- 2025-04-24 (§ 18) och 2025-06-05 (§ 31) &mdash; revisionen riktade en formell anmärkning mot
  socialnämnden för kvalitets- och verksamhetsbrister i äldreomsorgen 2024; fullmäktige röstade ner
  (22&ndash;10) ett förslag om att själv skärpa anmärkningen ytterligare
- 2025-08-28 (§ 53) &mdash; bekräftar samma 23&ndash;22-mönster redan vid minoritetsåterremissen som
  föregick 2025-10-16-beslutet
- 2025-01-30 &mdash; köpet och nybygget av Piläng-hallen godkändes (29&ndash;5&ndash;11 och 27&ndash;14 i
  två delvoteringar) genom ett gemensamt yrkande av Wenglén (M), Bengtsson (S) och Ahlström (M) &mdash;
  ett tidigt exempel på att M och S börjat samarbeta efter L:s uppbrott, med L, Fokus Bjärred och MP som
  gemensam opposition
- 2024-10-24 (§ 121) &mdash; SD, Fokus Bjärred och Sandra Pilemalm (L) yrkade under budgetdebatten att
  socialnämndens ordförande Susanne Borgelius (M) skulle avgå, med hänvisning till sex års
  budgetöverskridanden i nämnden. Avslogs 32&ndash;12 (1 avstod) &mdash; ännu ett dokumenterat exempel
  på att Pilemalm gick emot en M-ledd nämndsordförande redan hösten 2024, före både det formella
  utträdet ur Alliansen och 2025 års revisionsanmärkning mot samma nämnd

**Öppen research-tråd:** Liberalernas reservation i 2026-05-07-mötet nämner en grupp kallad "Den
alternativa moderata listan" i kommunfullmäktige, vars ledamöter offentligt sagt sig vilja stoppa
skolstängningarna men som inte röstade för motionen. Sökningar gav inga träffar &mdash; oklart om det
är en ny lista/utbrytning inför valet 2026, enskilda kritiska M-ledamöter, eller något annat. Flaggas
här för framtida uppföljning snarare än att gissa.

Ytterligare genomgångna möten utan egen nyhetspost: 2026-03-12 (SD reserverade sig mot
måltidspolicyn och SkyZero-finansieringen; Bjärreds vångar-besluten gick igenom utan opposition),
2025-09-25 (MP:s motion om trygghetsringning för äldre avslogs, se Miljöpartiets sakfrågor),
2022-11-10 (första mötet i innevarande mandatperiod &mdash; endast rutinärenden: nedläggning av en
"fritidsbank", uppdaterade arvodesregler och 2023 års budget med en skattesats på 19,64 kr),
2024-12-05 (Pilemalms återremissyrkande om grundskoleutredningen avslogs utan votering, hon
reserverade sig), 2023-08-31 och 2024-04-18 (rutinmässiga oppositionsreservationer utan votering,
inget utöver redan dokumenterade mönster).

De resterande ~20 protokollen är nedladdade men olästa. Vill du gräva djupare: läs `.txt`-filerna
direkt (snabbare än att öppna PDF:er), sök efter `Votering`/`Voteringsprotokoll`/`reserverar sig` för att
hitta kontroversiella ärenden, och för in fynden i `data/seed/news.json` eller relevant partis
`policyPositions` &mdash; för hand, som med all annan data i det här projektet. Fler protokoll (t.ex. 2027
och framåt) hämtas genom att navigera arkivet ovan och ladda ner på samma sätt.

## Kända begränsningar i v1

- **Ingen automatisk ingestion till databasen.** Allt som visas i appen är hand-kuraterat i `data/seed/`.
  `scripts/fetch-sources.ts` kan hämta råmaterial från publika sidor (se ovan), men matar aldrig in det
  direkt &mdash; ett medvetet val för att undvika att felaktig eller missvisande skrapad text hamnar på
  sajten oövervakat.
- **Facebook-inlägg saknas.** `SocialPost`-modellen och `data/seed/social.json` finns förberedda, men inga
  poster har seedats ännu &mdash; exakta publiceringsdatum och engagemangssiffror gick inte att verifiera
  tillförlitligt via sökning i denna omgång och kräver manuell insamling (inloggad i Facebook).
- **~20 av 40 nedladdade protokoll är olästa.** Fjorton möten (se ovan) är lästa i sin helhet med exakta
  röstsiffror inarbetade, ytterligare sex genomgångna utan egen nyhetspost. Övriga nyhetsposter i
  `data/seed/news.json` bygger fortfarande på kommunens egna nyhetssammanfattningar, inte
  originalprotokoll.
- **"Den alternativa moderata listan" är oidentifierad.** Nämns i en reservation 2026-05-07 men gick
  inte att verifiera vad den är &mdash; se research-tråden ovan.
- **En person utan parti.** En ledamot (Gun Larsson) sitter som politiskt oberoende i flera organ, utan
  partibeteckning i kommunens förtroendemannaregister. Hon har ingen egen partisida men syns i
  `/namnder`-listorna som "Oberoende" &mdash; och har visat sig ha en de facto vågmästarroll i minst två
  hårt omstridda voteringar (se ovan).
