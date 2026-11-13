# GLE: a more photographic renewable energy website

Refine the existing website in this folder. The owner has reviewed the current version and says it feels too much like a book. They want more photographs and a visual style closer to gle.az, solarisandmore.de and enphase.com/de-de. This brief supersedes the visual and homepage-structure instructions in BUILD-PROMPT.md and UPGRADE-PROMPT.md wherever they conflict. Keep the existing application, routes and working functionality; change the presentation rather than rebuilding the project.

Review localhost and these references in a browser before editing:
- https://gle.az/
- https://solarisandmore.de/
- https://enphase.com/de-de

## The direction

Build a confident, photograph-led renewable energy business website. Let visitors see solar installations, people working, buildings and equipment. Keep copy short, buttons clear and sections visually different. More photographs should change the composition of the page, not merely decorate the existing text blocks.

Borrow the renewable-energy atmosphere and broad photographic hero from GLE; the installation photography, human presence and clear service discovery from Solaris; and the large image-led sections with short headlines from Enphase. Create an original design using these principles. Do not copy their branding, claims, assets or product range.

The current localhost has a pale split hero with a tight roof crop, a tabbed service explorer, an educational energy diagram, a project questionnaire, process text, company text, training disclosures and FAQs. This is too much explanation on the homepage. Do not add more widgets or sections. Simplify and replace.

## New homepage composition

### 1. Compact header and large photographic hero

Keep the existing navigation and recognizable GLE wordmark. Use a clean white header with a clear green consultation button. Preserve sticky navigation and mobile functionality.

Replace the pale 50/50 hero with an edge-to-edge photograph: a real solar installation with a visible building or people installing panels. The photograph should occupy the entire hero, not sit in a small right-hand box. Use a dark localized overlay behind the text to maintain contrast while retaining vivid daylight elsewhere. This functional overlay is allowed even if the old brief prohibited gradients.

Place a short white headline on the left: “Sonnenenergie. Für Ihr Gebäude.” Below it, one sentence: “Photovoltaik und effiziente Gebäudetechnik für Zuhause und Unternehmen.” Primary button: “Beratung anfragen”. Secondary link: “Leistungen entdecken”.

Use approximately 560–680px hero height on desktop, adjusted to the actual viewport; on mobile use content-driven sizing and an intentional alternate crop. Keep the subject visible. Remove the current caption tab. No long paragraph, translucent text card or decorative dashboard overlay. Start with one exceptional photograph; no carousel is required.

### 2. Three photographic service cards

Replace the tabbed homepage service explorer with three large, simultaneously visible image cards. Visitors should immediately see the full offering. Each card has a distinct photograph, a title, one short sentence and a clear link:

- Photovoltaik — a wide view of installed solar panels on a residential or commercial building.
- Betrieb & Pflege — a technician inspecting or cleaning modules.
- Gebäudetechnik — appropriate heating/ventilation equipment or a technician working in a plant room.

The photos should occupy roughly two-thirds of each card. Use a consistent crop and restrained corners, and give the text a plain white base or readable dark overlay. No bullet lists on these homepage cards. Link to existing service anchors; preserve interest-prefilled consultation links on detail pages. Stack cards on mobile. A slight image zoom on hover is enough; provide equally clear keyboard focus styling.

### 3. One wide image-led feature

Use a panoramic solar-building photograph with the short headline “Energie vom eigenen Dach.” and one supporting sentence. This section should feel closer to Enphase's large photographic panels: strong image, short copy, one action. Choose a composition different from the hero, for example a complete contemporary house and its environment rather than workers or a panel close-up.

A small solid-white text panel beside or partially overlapping the image is acceptable if contrast requires it. Do not add another long explanatory section. CTA: “Photovoltaik entdecken”, linking to the existing service details.

### 4. Human presence and a compact process

Use an asymmetric two-photo composition: a larger installation/workmanship image and a smaller equipment-detail or consultation image. Beside it, use “Von der Idee bis zur Umsetzung.” with no more than two short sentences and three compact labels: “Beraten. Planen. Umsetzen.”

This replaces the separate long process and company-introduction blocks. Provide “Mehr über uns” as a text link. Generic stock workers must not be labelled as the actual GLE team. Do not invent staff, customer quotes or completed projects.

### 5. A compact training teaser

Use one landscape wind-turbine or practical-training photograph, a heading “Wissen für die Energiewende.”, one short sentence and “Schulungen entdecken”. Remove homepage training accordions; retain their useful content on the Schulungen page.

### 6. A photographic consultation finish

Finish with a landscape installation photograph under a forest-green/dark overlay and a short heading: “Ihr Vorhaben beginnt mit einem Gespräch.” Add “Beratung anfragen”, followed by the existing compact footer. This replaces the large plain-green text block. Keep any repeated photography out of this section; every major photograph should show a different subject or perspective.

## Reduce the book-like feel

- Move the energy-flow illustration and its explanations to the Photovoltaik detail area. Do not discard useful functionality, but remove it from the homepage.
- Move the project selector into the consultation/contact journey. Keep direct contact access and the existing selected-interest handoff. It should not occupy a large homepage section.
- Move FAQs to the relevant services or contact page. Keep accessible disclosure behavior.
- Aim to reduce visible homepage prose by approximately half. Most sections need a heading, one sentence and an action. Avoid consecutive paragraphs, lists and divider-heavy sections.
- Keep comfortable spacing but eliminate large empty pale bands. Alternate broad photographs, image cards and concise white sections.
- Do not add an arbitrary project gallery filled with stock images. Integrate photos into the service story instead.

## Photography requirements

Use approximately 7–9 distinct, well-chosen photographs across the homepage, depending on the final composition. Avoid reusing the same house in the hero, service cards and company section. The existing assets can remain only where their subject, quality and crop fit.

Required visual variety: wide PV installation, whole building, maintenance work, technical equipment, people working, close-up workmanship and wind/training context. Favor realistic European environments and consistent natural daylight. Keep solar panels physically plausible and installation practices credible.

Source usable, properly licensed photographs and record the source URL, author and license in an asset manifest. Do not hotlink or download the reference companies' photos for reuse without permission. Stock images must not be presented as GLE projects, employees or customers. Avoid prominent third-party logos and products implying a partnership.

Actually add the image assets and implement them; do not finish with empty boxes, broken URLs or a list of photos the owner should find. If a suitable asset cannot be sourced, explain the specific limitation and use the best existing licensed image where appropriate. Optimize local AVIF/WebP images with responsive variants, explicit dimensions and useful German alt text. Load the hero promptly and lazy-load below-fold imagery. Do not sacrifice image quality with visibly blurred compression.

## Style and motion

Retain the green brand. Use forest green for typography and dark sections, a slightly livelier natural green for accents, and clean white backgrounds. Verify button contrast. Let the photography supply blue skies, vegetation and warm natural tones rather than adding decorative color blocks.

Keep the existing fonts, but use shorter, bolder headings and a clearer hierarchy. Desktop hero heading around 56–72px, mobile around 36–44px. Avoid long all-caps labels, excessive letter spacing, thin borders everywhere and repeated boxed text.

Use subtle photo reveals, small button-arrow movements and optional 1.03-scale image hover effects. Respect reduced motion. Keep content visible without animation support. No scroll hijacking, spinning icons, animated counters or continual motion. Large photographs and composition should create the energy of the page.

## Other pages and existing functionality

Give Leistungen a photographic introduction and one relevant image for each service group. Add a suitable image to Über uns and Schulungen where needed. Keep contact primarily functional, with a supporting image only if it fits without pushing the form down on mobile. Avoid rebuilding all pages or adding new offerings.

Preserve routing, mobile navigation, keyboard access, metadata, validated form behavior and demo disclosure. Do not claim that messages are sent when the backend is disconnected. Do not invent savings, certifications, reviews, company history, project counts, service coverage or partnerships. Do not add batteries, chargers or named manufacturer products solely because the reference sites sell them.

## Verify and deliver

Implement the redesign rather than just explaining it. Inspect actual rendered screenshots at 390px, 768px and 1440px. Check image crops, text contrast over images, mobile stacking, links, relocated selector behavior, form validation and reduced motion. Run the existing build and checks.

The result should visibly look different at first glance: a large photographic hero, multiple distinct service photos, real-world work and equipment, shorter copy, and a simpler homepage. It must not remain the same pale text-heavy layout with a few extra thumbnail images. Summarize changes and validation; do not deploy.
