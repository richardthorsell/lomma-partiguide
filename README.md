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
fact-check-genomgång). **Samtliga 40 protokoll är nu genomgångna i sin helhet** (2026-08-24).
Femton av dem har gett upphov till konkreta poster i `data/seed/news.json` med exakta röstsiffror:

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
- 2026-06-17 (§ 65) &mdash; kommunens sista protokollförda möte före valet 2026. Jenny Morau (Fokus
  Bjärred) interpellerade barn- och utbildningsnämndens ordförande om gymnasiets ekonomiska
  hållbarhet &mdash; en öppen fråga att följa upp, eftersom det sakliga svarsinnehållet inte fångades i
  textextraktionen

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

**Samtliga 40 nedladdade protokoll (2022-01-27 till 2026-06-17) är nu genomgångna.** Utöver
mötena ovan lästes hela den återstående gamla mandatperioden (2022-01-27 till 2022-10-17, samt
det konstituerande mötet 2022-12-01) och 2023&ndash;2025 års återstående rutinmöten
(2023-02-02, 2023-03-02, 2023-04-20, 2023-05-11, 2023-06-01, 2023-12-07, 2024-02-01, 2024-05-30,
2024-09-26, 2025-03-13). Inget av dessa innehöll voteringar eller sakfrågor som konkurrerar med det
som redan är dokumenterat &mdash; mestadels avsägelser, val av ledamöter, taxor/reglementen och
motioner som besvarades utan votering. Två undantag värda att notera utan att de fick egna
nyhetsposter: dels att Sandra Pilemalm (L) redan var en aktiv motionär i den gamla mandatperioden
(bl.a. en enhälligt bifallen motion om handlingsplan mot hedersrelaterat våld, 2022-01-27), dels att
Fokus Bjärred tidigt drev frågan om att lokalisera kommunal förvaltning i norra kommundelen
(2022-01-27, motionen ansågs besvarad utan bifall).

Vill du gräva ännu djupare i redan lästa protokoll, eller granska nya möten när fler tillkommer: läs
`.txt`-filerna direkt (snabbare än att öppna PDF:er), sök efter
`Votering`/`Voteringsprotokoll`/`reserverar sig` för att hitta kontroversiella ärenden, och för in fynden i
`data/seed/news.json` eller relevant partis `policyPositions` &mdash; för hand, som med all annan data i
det här projektet. Fler protokoll (t.ex. 2027 och framåt) hämtas genom att navigera arkivet ovan och
ladda ner på samma sätt.

### Nämndprotokoll (Barn- och utbildningsnämnden, Socialnämnden, Kommunstyrelsen,
Kultur- och fritidsnämnden, Samhällsbyggnadsnämnden)

Utöver kommunfullmäktige har arkivet ovan egna mappar per nämnd, med samma
`docs.netpublicator.com/api/public/r01696490/document/{id}?hash=...`-URL-mönster som
kommunfullmäktigeprotokollen. Miljö- och byggnadsnämnden är fortsatt undantagen (handlingar
begärs ut via miljo-byggnadsnamnd@lomma.se, inte publicerade här).

**Nedladdat och genomgånget för nuvarande mandatperiod (2023&ndash;), i
`data/sources/protokoll-namnder/{bun,sn,ks,kfn,sbn}/`:**

| Nämnd | Protokoll hämtade | Kommentar |
| --- | --- | --- |
| Barn- och utbildningsnämnden (BUN) | 29 av 29 hittade | Alla ursprungligen "blockerade" dokument hämtades vid en andra försök &mdash; se nedan |
| Socialnämnden (SN) | 15 av 15 hittade | ~10 ytterligare möten 2023&ndash;2025 saknar publicerat protokoll (endast kallelse) |
| Kommunstyrelsen (KS) | 17 av 17 | Arkivet går bara tillbaka till 2025-01-22 &mdash; inga KS-protokoll för 2023&ndash;2024 hittades i den publika mappstrukturen |
| Kultur- och fritidsnämnden (KFN) | 11 av 11 hittade | Alla ursprungligen "blockerade" dokument hämtades vid en andra försök &mdash; se nedan |
| Samhällsbyggnadsnämnden (SBN) | 6 av 6 hittade | Nästan alla möten 2022 t.o.m. augusti 2025 saknar publicerat protokoll (endast kallelse) &mdash; protokoll börjar dyka upp först från 2025-09-01 |

**En genomgående observation:** flera nämnder (särskilt Socialnämnden och
Samhällsbyggnadsnämnden) publicerade under stora delar av 2022&ndash;2025 bara mötets kallelse
(dagordning) till den här publika arkivtjänsten, inte det faktiska justerade protokollet med
beslut/voteringar. Det är alltså en lucka i kommunens egen publicering, inte något vi kan hämta in i
efterhand. Kommunstyrelsen och kommunfullmäktige verkar däremot ha publicerat protokoll
konsekvent under hela perioden.

**Kontrollerat specifikt för gamla mandatperioden (före 2023-01-01):** endast Samhällsbyggnadsnämnden
har en publik 2022-mapp (11 möten, 2022-01-31&ndash;2022-12-12), och den innehåller liksom
2023&ndash;2024 bara kallelser, inga protokoll. Barn- och utbildningsnämnden, Socialnämnden,
Kommunstyrelsen och Kultur- och fritidsnämnden saknar helt en 2022-mapp i den publika
arkivstrukturen &mdash; de fem nämndernas protokollarkiv börjar alla vid eller efter mandatperiodens
start.

**Om "nätverksblockeringen":** de dokument som tidigare gav `403 Forbidden` från Zscaler visade sig
vara en tillfällig spärr, inte permanent &mdash; ett nytt nedladdningsförsök (med några sekunders
mellanrum mellan varje anrop) fick igenom samtliga 11 tidigare blockerade dokument. Alla nämnders
arkiv är därmed nu kompletta utifrån vad som faktiskt är publicerat.

**Viktiga fynd från nämndprotokollen** (utöver det som redan fanns dokumenterat via
kommunfullmäktige):

- **Kommunstyrelsen 2025-06-18 (§ 94&ndash;95):** den ursprungliga rekommendationen att stänga
  Strandskolan och Löddesnässkolan godkändes av kommunstyrelsen fyra månader före
  kommunfullmäktiges 23&ndash;22-beslut &mdash; med en ännu snävare marginal, 7&ndash;6 av
  kommunstyrelsens 13 ledamöter, i båda ärendena.
- **Kommunstyrelsen 2026-04-22 (§ 52):** samma 7&ndash;6-mönster upprepades när kommunstyrelsen
  avslog en S-motion om att stoppa åtgärder som försvårar en återöppning av skolorna &mdash; två veckor
  före den redan dokumenterade 22&ndash;22-omröstningen i kommunfullmäktige om samma fråga.
  Protokollet bekräftar också att Sandra Pilemalm formellt satt för Fokus Bjärred redan vid det här
  mötet.
- **Socialnämnden 2026-05-05 (§ 29, § 34):** lokalförsörjningsplanen 2026&ndash;2035 föreslår att ett nytt
  äldreboende byggs på platsen där Löddesnässkolans huvudbyggnad står idag &mdash; vilket i praktiken
  skulle göra en återöppning av skolan omöjlig. Ida Alms (L) invändning röstades ner 6&ndash;5. Samma
  möte röstade ner Liberalernas egen motion om ett återinfört korttidsboende för äldre, också 6&ndash;5.

## Kända begränsningar i v1

- **Ingen automatisk ingestion till databasen.** Allt som visas i appen är hand-kuraterat i `data/seed/`.
  `scripts/fetch-sources.ts` kan hämta råmaterial från publika sidor (se ovan), men matar aldrig in det
  direkt &mdash; ett medvetet val för att undvika att felaktig eller missvisande skrapad text hamnar på
  sajten oövervakat.
- **Facebook-inlägg saknas.** `SocialPost`-modellen och `data/seed/social.json` finns förberedda, men inga
  poster har seedats ännu &mdash; exakta publiceringsdatum och engagemangssiffror gick inte att verifiera
  tillförlitligt via sökning i denna omgång och kräver manuell insamling (inloggad i Facebook).
- **Samtliga 40 kommunfullmäktigeprotokoll är genomgångna** (2026-08-24), femton med egna, exakta
  röstsiffror i `data/seed/news.json`. Merparten av de återstående mötena var rutinärenden (val av
  ledamöter, avsägelser, taxor) utan votering. Nya protokoll tillkommer varje kommunfullmäktigemöte
  &mdash; se `scripts/fetch-sources.ts` för hur arkivet hålls uppdaterat.
- **Nämndprotokoll (BUN, SN, KS, KFN, SBN) är fullständigt genomgångna utifrån vad som är
  publicerat** (2026-08-24, uppdaterat efter en andra nedladdningsrunda som fick igenom samtliga
  tidigare "blockerade" dokument) &mdash; se tabellen och fynden ovan. Täckningen är ändå ojämnare än
  för kommunfullmäktige, av skäl utanför vår kontroll: flera nämnder publicerade bara kallelser (inte
  det faktiska protokollet) till den publika arkivtjänsten under stora delar av 2022&ndash;2025, och
  Kommunstyrelsens protokollarkiv sträcker sig bara tillbaka till 2025-01-22 i den publika
  mappstrukturen.
- **"Den alternativa moderata listan" är oidentifierad.** Nämns i en reservation 2026-05-07 men gick
  inte att verifiera vad den är &mdash; se research-tråden ovan.
- **En person utan parti.** En ledamot (Gun Larsson) sitter som politiskt oberoende i flera organ, utan
  partibeteckning i kommunens förtroendemannaregister. Hon har ingen egen partisida men syns i
  `/namnder`-listorna som "Oberoende" &mdash; och har visat sig ha en de facto vågmästarroll i minst två
  hårt omstridda voteringar (se ovan).
