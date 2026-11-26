# Portfolio integration — 16 November 2026

Reviewed all 37 pages visually and extracted all text from the user-supplied Altay_Rustamov - Portfolio.pdf.

## Coverage

- Pages 1–6: company background, geographic collaboration, integrated PV/heat-pump approach reflected in company content; original explanatory pages remain available in the downloadable PDF.
- Pages 7–8: all 51 numbered entries transcribed into src/config/references.ts with original numbering, equipment, location, listed PV values and storage capacities.
- Pages 9–28: all embedded project photographs extracted and associated with the corresponding reference. Page 24 is a PV project despite its “Seminars” heading.
- Pages 29–30: WOLF and Clivet manufacturer training on Schulungen.
- Page 31: 2021 founding of GLE LLC, Karabakh off-grid planning, university laboratory and developing training initiative on Über uns.
- Pages 32–34: PV and wind courses and heat-pump training on Schulungen; water-pressure energy project on Über uns.
- Pages 35–37: university and industrial collaboration, patent claim, exhibitions and founder biography on Über uns. Repeated text on page 37 included once.
- Entire original document is downloadable; addresses are presented as portfolio locations, not substituted for the still-unconfirmed German legal operator.

## Source ambiguities retained for owner review

- Entries 11 and 15: identical Elz address and specifications but two different photo pages (17 and 19). Kept as separate original entries, not claimed as 51 unique projects.
- Entry 16: list says 40 apartments, photo page 22 says 30. Website says Mehrfamilienhaus without a count.
- Entry 37: list says Huawei; page 26 says Solaris / BYD. Website omits the disputed PV/storage brands, retains consistent capacities and Dimplex heat pump.
- Entry 1: list describes Daikin fan coils; photo page describes Daikin heat pump. Website uses Daikin heating/cooling system.
- PV values use the source wording “kWp inverter,” which mixes a PV unit with inverter terminology. Kept transparently as “PV laut Portfolio”; do not reinterpret as verified inverter kW or independently verified array capacity.
- “110 MW power facilities” in the planned training initiative is technically ambiguous; website retains the developing switchgear training initiative without this rating.
- Source misspelling “Fornius” normalized to Fronius; location/street spellings otherwise preserved where ambiguous.
- No dates, prices, certifications, efficiency savings or new partnerships invented. Historical building-law and generalized percentage claims were not turned into current advice.

## Curated presentation

At the owner’s request, the public references page now presents four projects instead of the full 51-entry directory:

- Finkenweg, Wesseling: residential PV and battery storage, with strong roof and equipment photographs.
- Am Engelshof, Cologne: integrated PV/storage and a heat-pump cascade for ten apartments.
- Germaniastraße, Cologne: a solar parking canopy, showing a different type of installation.
- Golden Tulip Parkhotel, Neu-Ulm: commercial heating and cooling, using the source-neutral Daikin description.

The page has one large photographic feature and three concise project cards. Details and additional photos open in an accessible native dialog. Repetitive listings, duplicate photo sections and filters were removed. Original reference data remains archived in the source configuration and the complete PDF stays downloadable. The earlier coverage and ambiguity notes document the source material, not a requirement to display every entry.

## Validation

npm run build; node scripts/check-portfolio.mjs against the preview server on 127.0.0.1:4173. Local only; not deployed.
