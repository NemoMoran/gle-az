# Build a refined German renewable energy website

Act as a senior web designer and frontend engineer. Build a complete local website in this folder. Read REFERENCE-REVIEW.md first. The reference is https://gle.az/, but the new website is for a Germany-facing business and should have a substantially better, simpler design.

Do the implementation, not just a proposal. Make thoughtful defaults and continue without a long questionnaire. The user values visual quality and simplicity above feature count.

## Purpose and positioning

Create a credible renewable energy and building-services website that helps prospective residential and commercial clients understand the services and request a consultation. Treat this audience choice as a working assumption. Use “GLE” and “Green Life Engineering” as editable working branding, not a claim of an established German legal entity.

Keep the reference's service and training concept. Do not turn this into an energy supplier, electricity tariff comparison site, SaaS dashboard or online shop.

## Art direction: daylight, landscape, engineering

The site should feel calm, precise and connected to real renewable energy infrastructure. Lead with beautiful daylight photography of photovoltaic panels on contemporary European buildings, with greenery or open sky. Avoid generic leaf-in-hand imagery and glowing futuristic technology.

Use this compact token system:

- Paper white: #FAFCFA — primary background.
- Forest: #173E2B — headings, primary buttons and footer.
- Leaf: #527A42 — restrained secondary accents.
- Mist: #EAF0E8 — occasional section backgrounds.
- Ink: #202C25 — body text.
- Line: #D7E1D7 — subtle borders.

Use white text on forest buttons. Verify contrast rather than assuming every palette pairing works. No gradients, glassmorphism, neon green or deep shadows.

Typography: Manrope for expressive, confident headings and Source Sans 3 for readable body text, preferably locally hosted with system fallbacks. Use restrained weights and normal letter spacing. Desktop hero heading around 64–76px, mobile 38–44px; body 18px with comfortable line height. Keep paragraphs to approximately 60 characters per line.

Layout: maximum content width approximately 1200px, 24px mobile gutters, 64–96px desktop section spacing. Modest 8–12px corner radii, thin borders and very limited shadows. Do not place every section inside a card.

Signature composition: a spacious split hero, with the headline on a quiet white left panel and one tall, beautifully cropped solar-roof photograph on the right. Let the solar panel geometry provide visual character. A small inset caption may identify the subject as “Photovoltaik · Energie vom eigenen Dach”, without implying a real completed company project. On mobile, place copy above the image. No slideshow or autoplay video.

Keep the rest of the page quieter than the hero. Use compact line icons only where they clarify content. Motion should be limited to short button/link transitions and subtle optional reveals, respecting reduced motion. Content must remain visible if animation fails.

## Pages and navigation

Build a polished homepage plus concise pages for Leistungen, Über uns, Schulungen and Kontakt. Add draft Impressum and Datenschutz pages in the footer. Header: simple typographic GLE wordmark, the four navigation links and “Beratung anfragen”. Logo links home. Do not add a language switch unless a real translated version exists.

Homepage structure:

1. Compact header, approximately 80px tall on desktop.
2. Split hero with one primary and one secondary action.
3. A short service introduction followed by three clear service groups.
4. A simple three-step process.
5. A restrained company introduction with a supporting photo or technical detail.
6. A compact training teaser.
7. A forest-green closing consultation section.
8. A minimal footer with useful links and legal-page links.

Do not add invented statistics, customer logos, star ratings or testimonials to fill space. Omit a project gallery until actual projects are supplied.

## German copy and service scope

Use polished, natural German and formal “Sie”. Suggested hero:

Eyebrow: “Photovoltaik & effiziente Gebäudetechnik”

Headline: “Energie, die weiterdenkt.”

Supporting text: “Photovoltaik, Monitoring und effiziente Gebäudetechnik. Entdecken Sie Lösungen für Ihr Zuhause oder Ihr Unternehmen.”

Primary CTA: “Beratung anfragen” → Kontakt.
Secondary CTA: “Leistungen entdecken” → services section or Leistungen page.

Service groups:

- Photovoltaik: planning and installation as the proposed offering; explain the path from assessing requirements to an individually planned system.
- Betrieb & Pflege: monitoring, maintenance and professional panel cleaning.
- Gebäudetechnik: heating, cooling and ventilation, described simply without assuming particular products or certifications.

These groups are derived from the reference, but their availability in the German business is unconfirmed. Centralize their content so the owner can easily adjust it. Do not automatically add EV chargers, battery sales, heat-pump installations or utility-scale wind services as confirmed offerings.

Process heading: “In drei Schritten zu Ihrer Energielösung”. Steps: “Bedarf klären”, “Lösung planen”, “Umsetzung abstimmen”. Use short explanatory sentences without guarantees or invented deadlines.

Training teaser: “Wissen für die Energiewende.” Introduce photovoltaic and wind-energy learning topics. On the Schulungen page provide two concise topic descriptions with “Interesse anfragen” actions; do not invent dates, prices, accreditation or partnerships.

Closing CTA: “Lassen Sie uns über Ihr Vorhaben sprechen.” Supporting line: “Beschreiben Sie kurz Ihr Projekt. Gemeinsam klären wir die nächsten Schritte.” Button: “Beratung anfragen”.

Über uns should explain the proposed approach to renewable energy and practical engineering, without inventing a founding year, team members, German office, installed capacity or experience claims.

## Contact and production boundaries

Create a well-designed contact form with Name, E-Mail, optional Telefon, Interesse and Nachricht. Include accessible labels, validation and clear feedback. In the local prototype, explicitly show that the form is a demo and does not send data. Never show “sent successfully” when there is no backend. Keep any future submission adapter separate and document where to connect it.

Store unknown company name/legal form, address, phone, email and service region in a clearly documented configuration file. Do not use gle.az contact details for the German version. Avoid ugly unresolved placeholders in the hero; unknown administrative details can be visibly marked in the draft legal pages and launch checklist.

Impressum and Datenschutz are editable drafts requiring actual operator and processing details. Do not claim legal compliance. Avoid analytics, tracking pixels, embedded maps and unnecessary cookies in the prototype. Do not add an ornamental cookie banner when nothing requires consent.

The source site links to an external calculator. Omit it from version one for simplicity. Do not copy its referral URL or invent financial estimates. Record a calculator as a possible later enhancement.

## Implementation

Use a lean, maintainable React + TypeScript + Vite setup unless this folder already contains an appropriate application. Use clean CSS variables for the design system. Avoid a large component library for such a small site. Keep routes directly accessible and document the static host fallback requirement.

Use original or properly licensed photographs, record asset sources, and ensure images actually load. Prefer locally stored optimized assets with explicit dimensions and descriptive German alt text. Do not hotlink or copy gle.az assets. If suitable assets are unavailable, explain the limitation instead of silently shipping broken images. Use a simple original typographic wordmark until an approved logo is provided.

Include semantic landmarks, one primary heading per page, keyboard-operable navigation, visible focus states, adequate touch targets and a working mobile menu. Provide descriptive page titles and German metadata. Do not generate false business structured data.

## Finish and verify

Run the production build and available checks. Inspect the rendered website at approximately 390px, 768px and 1440px widths. Check navigation, direct route loading, mobile menu, form errors, keyboard interaction, image loading and horizontal overflow. Fix issues before finishing. If browser inspection is unavailable, state that clearly.

Critique the visual result: does the hero feel considered, is the first screen calm, does the photography carry the renewable energy identity, and is there a clear next action? Remove unnecessary decoration and repeated calls to action. Deliver the finished local site with startup instructions, a brief validation summary and a concise list of information still needed before launch. Do not deploy automatically.
