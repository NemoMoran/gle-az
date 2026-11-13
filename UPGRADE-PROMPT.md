# Design and interaction upgrade

Improve the existing GLE website in this folder. Inspect the running site and existing components before editing. This is a refinement of the current React application, not a rebuild or a change of business model. Keep the German language, green identity, existing routes, useful copy, accessibility features and honest demo-form behavior. Implement the changes below and verify the result in a browser.

## Review findings

The current desktop homepage has a clean header, readable typography and a coherent green palette. However, services and process both use three equal text columns with top dividers; the training area repeats the same text-and-divider treatment. The experience feels more like a brochure than a contemporary energy company. The hero image is tightly cropped around roof tiles and panels, with little context. The contact page is functional but visually plain. Existing buttons already have basic hover/press effects, the header is already sticky, and the contact form already supports interest presets; improve those foundations rather than duplicating them.

Aim for a premium engineering company: confident imagery, clearer hierarchy, a useful interactive moment and controlled motion. Keep the experience simple. Prioritize the hero and service presentation first, then the project selector, then motion and supporting details.

## 1. Refine the hero

Keep the split composition and forest-green typography. Use a wider, more intentional crop showing the relationship between the photovoltaic roof, building and sky. If the current asset cannot do this, source an appropriate licensed replacement and record its source. Use responsive image positioning so mobile crops remain meaningful.

Use a clearer heading such as “Ihr Gebäude. Ihre Energie.” with the supporting text “Photovoltaik und effiziente Gebäudetechnik — passend zu Ihrem Zuhause oder Unternehmen.” Keep the primary CTA “Beratung anfragen”. Change the secondary action to “Passende Lösung finden”, linking to the project selector below.

Keep the hero compact enough that visitors can sense the next section on typical desktop screens. Avoid rigid full-viewport sizing. Add a single gentle entrance sequence: headline, description and actions fade and translate upward by 12–16px, with approximately 70ms stagger and 450–600ms durations. Do not animate each letter or hide the main image until an animation completes.

## 2. Give services a distinctive visual presentation

Replace the homepage's three equal text columns with a two-column service explorer: a concise list of the three service groups on the left and one generous relevant image, short explanation and CTA on the right. Selection changes the detail panel with a short crossfade. Keep only one panel active; do not autoplay.

Groups remain Photovoltaik, Betrieb & Pflege, and Gebäudetechnik. Each option needs a short description and a clear selected state. Use accessible tabs with arrow-key navigation, or a simpler native-button pattern with explicit relationships and state. On mobile use stacked disclosures instead of a cramped horizontal tab bar. Important content must be reachable by touch and keyboard, not hover alone.

Reuse existing detail routes. “Mehr zu Photovoltaik” must still lead to the relevant service. Include “Dazu beraten lassen” with the existing interest preset. Avoid making nested interactive controls inside a clickable card.

## 3. Add one signature energy-flow illustration

Introduce a compact section titled “So wird aus Sonne Strom.” Use a carefully drawn responsive SVG diagram showing Sonne → Solarmodule → Wechselrichter → Gebäude, with a clearly labelled connection to the Stromnetz. This is an educational schematic, not live production data or a technical installation plan.

Make the three equipment/building nodes selectable to reveal a short explanation. A subtle flow animation may run once when the section enters view and again when the visitor changes selection. Do not create a constantly flashing dashboard. Use the site's existing forest/leaf/mist palette. Provide visible text labels and accessible HTML buttons; ensure a readable static version with reduced motion. Do not add batteries or other unconfirmed services as if they are supplied by the business. Label it “Vereinfachte Darstellung”.

Keep this section concise and integrate it into the existing page rhythm. Shorten redundant prose elsewhere so the homepage does not simply become much longer.

## 4. Add a useful project selector

Create an inline section titled “Was möchten Sie angehen?” with two short questions:

- “Für welches Gebäude?” Options: Wohnhaus, Gewerbe, Noch offen.
- “Worum geht es?” Options: Neue Photovoltaikanlage, Bestehende Anlage betreuen, Gebäudetechnik, Noch unsicher.

Use clear selectable buttons with visible selected states. Display a short plain-language summary and “Beratung zu meinem Vorhaben” action after selection. Allow changing selections. Do not require personal data here and do not describe this as an eligibility check or savings calculator.

Carry the selected interest and building type into the existing contact form using session-scoped state or appropriate non-personal URL parameters. Reuse its existing interest values. Show an editable summary on the contact page, preserve user-written messages, and avoid silently overwriting form fields. Unknown/undecided selections should lead to a general consultation. Direct contact links must continue working without using the selector.

## 5. Improve rhythm and supporting interactions

Keep the three-step process but visually connect its numbered steps with a fine line on desktop and a vertical line on mobile. Animate the line once on entry; keep all explanations readable without clicks. This should feel different from the services section.

Reduce overly long headings and repeated supporting paragraphs. Use alternating image/text and white/mist sections intentionally. Keep the large forest-green closing CTA as the main visual anchor near the bottom.

Make training topic rows useful: each can expand to reveal a brief “Das lernen Sie” list and an “Interesse anfragen” link with the correct contact interest. Do not invent dates, credentials or prices.

Add a concise FAQ before the closing CTA with four practical questions: “Welche Angaben helfen beim ersten Gespräch?”, “Kann ich eine bestehende Anlage betreuen lassen?”, “Ist eine Anfrage auch ohne konkrete Planung möglich?” and “Bieten Sie auch Schulungen an?”. Write answers using only the service scope and process already described. Use accessible disclosures, with visible focus states and restrained expand/collapse motion.

## 6. Polish motion and controls consistently

Use CSS transitions and IntersectionObserver where sufficient; avoid a heavyweight animation dependency for simple effects. Suggested durations: controls 150–200ms, panel changes 200–300ms, section entrances 400–550ms. Reveal a section once with a maximum 12–16px translation. Do not stagger every paragraph or force users to wait for content.

Improve the existing button hover effects with a subtle arrow shift and clear pressed state. Keep focus styling equally deliberate. The header is already sticky: add only a subtle scrolled-state border/shadow if needed, without changing its height or shifting content. Do not add scroll hijacking, cursor effects, magnetic buttons, auto-rotating carousels, animated counters, parallax-heavy sections or background video.

Honor prefers-reduced-motion across all new effects. Offscreen animations should not run indefinitely. Content must remain available when observers or animations fail.

## 7. Refine the contact layout

Give the form a gently defined white surface with a thin border, intentional padding and stronger grouping. Align field baselines: the existing optional-phone hint makes the adjacent dropdown appear vertically mismatched. Preserve labels, inline validation, error-summary links and focus management.

When launched from the selector, show the selected project context above the form with an edit option. Keep the demo disclosure clear and concise. Do not remove it or simulate a real successful submission while no delivery backend exists. No external messages should be sent as part of this task.

## Constraints and acceptance criteria

- Preserve the existing lightweight architecture and locally hosted fonts/images where possible.
- No fake reviews, installed-capacity numbers, certifications, customer logos, live generation figures or guaranteed savings.
- Do not add new service claims, tracking, dependencies or backend requirements without a concrete need.
- Verify at 390px, 768px and 1440px widths. Test service selection, keyboard navigation, project-selector handoff, edit/back behavior, direct contact visits, training disclosures, FAQ and mobile menu.
- Test reduced motion, image loading, route changes and horizontal overflow. Ensure sticky UI never obscures focused elements or anchor destinations.
- Run the existing build/check scripts. Inspect screenshots of the actual result and correct awkward spacing, crop issues and excessive motion.
- Summarize changed files, checks run and any remaining limitations. Do not deploy.

Deliver an intentional visual upgrade with meaningful interactions, not a collection of unrelated widgets. If the full set makes the page feel crowded, preserve the service explorer and project selector, and simplify the educational diagram or supporting sections.
