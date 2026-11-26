# GLE · Green Life Engineering, Website-Prototyp

Lokaler Prototyp einer deutschsprachigen Website für Photovoltaik, Betrieb & Pflege, Gebäudetechnik und Schulungen. React, TypeScript und Vite, eigenes CSS mit Design-Tokens, lokal gebündelte Schriften, keine Tracking- oder Drittdienste, keine Animationsbibliothek.

Status: fertig gebaut und lokal geprüft, **nicht veröffentlicht**. Marke, Leistungsumfang, Firmendaten und Rechtstexte sind Arbeitsstand und müssen vor dem Launch bestätigt werden (siehe [Vor dem Launch](#vor-dem-launch)).

Stand der Gestaltung: Am 17. November 2026 wurde die gesamte Website neu gestaltet (Auftrag: deutlich besser, mehr Bewegung, neue Fotopräsentation, bessere Referenzen). Dieser Auftrag ersetzt die Gestaltungsvorgaben aus `BUILD-PROMPT.md`, `UPGRADE-PROMPT.md` und `PHOTO-REDESIGN-PROMPT.md`, wo sie sich widersprechen, insbesondere die früheren Verbote von Laufbändern, Zählern, Parallaxe und großen Radien. Unverändert gelten die inhaltlichen Regeln aus `CLAUDE.md` und den Briefings: deutsche Texte in der Sie-Form, nichts Erfundenes, Formular ohne Versand, keine Veröffentlichung ohne Freigabe.

Die Briefing-Dateien `BUILD-PROMPT.md`, `REFERENCE-REVIEW.md`, `UPGRADE-PROMPT.md`, `PHOTO-REDESIGN-PROMPT.md`, `PORTFOLIO-REVIEW.md` und `CLAUDE.md` bleiben als Projektgrundlage erhalten.

## Schnellstart

Voraussetzung: Node.js 20.19 oder neuer (getestet mit Node 24).

```sh
cd /Users/muradayvaz/Desktop/gle-az
npm install
npm run dev
```

Die Seite läuft dann unter <http://127.0.0.1:5173/>. Produktionsbuild und Vorschau:

```sh
npm run build      # Typprüfung + Build nach dist/ + Vorrendern aller Routen
npm run preview    # dist/ lokal ausliefern (http://localhost:4173/)
```

Hinweis: Unter Node 24 bindet `vite preview` an `localhost` (IPv6). Wer die Vorschau unter `127.0.0.1` braucht, etwa für die Prüfskripte, startet sie mit `npx vite preview --host 127.0.0.1 --port 4173`.

## Skripte

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | `tsc --noEmit`, `vite build` nach `dist/` und Vorrendern aller Routen (`scripts/prerender.mjs`) |
| `npm run preview` | Produktionsbuild lokal ausliefern |
| `npm run typecheck` | Nur Typprüfung |
| `npm run images` | Fotos aus `assets-src/` nach `public/images/` zuschneiden (AVIF, WebP, JPEG) und `SOURCES.md` schreiben; Unterordner wie `portfolio/` bleiben unberührt |
| `node scripts/check-site.mjs` | Browser-Prüfung der ganzen Website gegen eine laufende Instanz (siehe [Prüfung](#prüfung)) |
| `node scripts/check-portfolio.mjs` | Browser-Prüfung der Referenzen und der Fotogalerie gegen die Vorschau auf Port 4173 |

## Struktur

```
index.html                  HTML-Hülle, Metadaten, Platzhalter für das vorgerenderte HTML
src/main.tsx                Einstieg im Browser: übernimmt vorgerendertes HTML (Hydration) oder rendert neu
src/entry-server.tsx        Einstieg für das Vorrendern im Build
src/App.tsx                 Routen
src/components/             Gerüst:      Layout, SiteHeader mit SiteNav, SiteFooter, Wordmark
                            Bausteine:   Picture (AVIF/WebP/JPEG), PortfolioImage, ButtonLink, ArrowLink,
                                         PageHero, ConsultationCta, Lightbox, Disclosure, Faq, Draft
                            Bewegung:    SplitText, Marquee, CountUp
                            Startseite:  HeroSpotlight, ServiceShowcase, ProcessScroll, ReferenceCarousel
                            Unterseiten: EnergyFlow (Leistungen), ProcessSteps (Über uns), ContactForm (Kontakt)
src/pages/                  Startseite, Leistungen, Referenzen, Über uns, Schulungen, Kontakt, Impressum, Datenschutz, 404
src/config/                 Alle änderbaren Inhalte und Stammdaten (siehe unten)
src/lib/useReveal.ts        Einblenden beim Sichtbarwerden (data-reveal)
src/lib/useScrollFx.ts      Eine Scroll-Schleife für Fortschrittsleiste, Parallaxe und scrollgeführte Werte
src/lib/contact/adapter.ts  Versandadapter des Kontaktformulars (Demo)
src/lib/vorhaben.ts         Schritt „Ihr Vorhaben“: Prüfung der Werte, Zusammenfassung, gemerkter Entwurf
src/styles/                 fonts.css, tokens.css, base.css (Grundlagen und Bewegung), components.css, pages.css
public/fonts/               Bricolage Grotesque und Geist (variabel, Latin und Latin Extended, OFL)
public/images/              Erzeugte Bildvarianten + SOURCES.md (Bildquellen)
public/images/portfolio/    Originalfotos aus dem Portfolio (WebP) + SOURCES.md
public/documents/           Das vollständige Portfolio als PDF
assets-src/                 Originalfotos der Stockmotive (nicht im Repository, siehe Bilder)
scripts/                    optimize-images.mjs, prerender.mjs, check-site.mjs, check-portfolio.mjs
```

## Inhalte anpassen

Alle Texte, die der Betreiber voraussichtlich ändern will, liegen zentral in `src/config/`:

| Datei | Inhalt |
| --- | --- |
| `site.ts` | Markenname, Firmen- und Rechtsdaten, Anschrift, Telefon, E-Mail, Einsatzgebiet, Domain. Alles, was `null` ist, wird ausgeblendet oder in den Rechtstexten sichtbar als offen markiert. |
| `services.ts` | Die drei Leistungsgruppen: Satz und Foto für die Bildflächen der Startseite, Absätze und Liste für die Leistungsseite. Umfang ist unbestätigt und bewusst ohne Wallbox, Speicherverkauf, Wärmepumpen-Installation oder Windkraft im Großmaßstab. |
| `facts.ts` | Die vier Kennzahlen (Startseite, Über uns) mit Quellenhinweis sowie die Stichworte des Laufbands. Jede Zahl stammt aus dem Portfolio; siehe Kommentar in der Datei. |
| `company.ts` | Texte von „Über uns“ und der Praxisliste der Schulungsseite: Gründer, internationale Arbeit, Standorte laut Portfolio, Kooperationen, Messen, durchgeführte Kurse. |
| `selected-references.ts` | Die vier gezeigten Referenzen: Titel, Beschreibung, Kennwerte, Alt-Texte, Startfoto. |
| `references.ts` | Vollständige Transkription der Referenzliste des Portfolios (51 Zeilen) und Pfad zum PDF. |
| `portfolio-images.json` | Zuordnung der Portfolio-Fotos zu den Seiten des PDFs. |
| `training.ts` | Die zwei Schulungsthemen, ohne Termine, Preise, Zertifikate oder Partner. |
| `process.ts` | Die drei Schritte (Startseite und „Über uns“). |
| `faq.ts` | Die vier häufigen Fragen auf der Kontaktseite. |
| `flow.ts` | Beschriftungen und Erklärtexte des Schaubilds „So wird aus Sonne Strom.“ |
| `contact.ts` | Auswahl-Chips des Schritts „Ihr Vorhaben“ im Kontaktformular. |
| `navigation.ts` | Haupt- und Rechtsnavigation. |
| `images.json` | Bildzuschnitte, Alt-Texte und Bildnachweise der Stockfotos. |

Die Überschriften und kurzen Sätze der Seiten stehen direkt in den Seitenkomponenten unter `src/pages/`, die Sätze der Zusammenfassung im Kontaktformular in `src/lib/vorhaben.ts`.

## Seiten

### Startseite

Neun Abschnitte, dreizehn verschiedene Fotos, sechs Absätze, die länger als ein, zwei Zeilen sind.

1. **Hero.** Ein Foto (Reihe moderner Häuser mit Photovoltaikdächern) in einem gerundeten Rahmen, der fast das ganze Fenster füllt; die Kopfleiste schwebt darüber. Unten links die Überschrift „Energie, die weiterdenkt.“ (153 px bei 1440 px Breite, 54 px bei 390 px), darunter Satz, „Beratung anfragen“ und „Leistungen entdecken“. Rechts unten eine Karte „Aus dem Portfolio“, die alle sechs Sekunden eine der vier Referenzen zeigt; sie lässt sich anhalten, und die vier Segmente wählen ein Projekt direkt.
2. **Laufband** mit den Stichworten der Leistungen (dekorativ, mit Schalter zum Anhalten).
3. **Leitsatz** „Gute Energielösungen beginnen nicht mit einem Produkt …“, der beim Scrollen Wort für Wort Farbe annimmt.
4. **Leistungen** (`ServiceShowcase`): drei Bildflächen. Ab 900 px stehen sie nebeneinander, die gewählte öffnet sich (Maus, Tastaturfokus, Tippen) und zeigt Satz und drei Stichpunkte; darunter stapeln sie sich und zeigen alles. Jede Fläche ist ein einziger Link zum Abschnitt der Leistungsseite.
5. **Kennzahlen** auf Nachtgrün: 15+ Jahre, 400+ Systeme, 51 Einträge der Referenzliste, 3 Länder. Sie zählen beim Sichtbarwerden hoch und nennen ihre Quelle (Portfolio).
6. **Ablauf** (`ProcessScroll`): Ab 900 px bleibt links ein Foto stehen und wechselt mit dem Schritt, der in der Bildmitte liegt; eine Linie füllt sich mit dem Fortschritt. Schmal steht jedes Foto bei seinem Schritt.
7. **Referenzen** (`ReferenceCarousel`): die vier ausgewählten Projekte als waagerechte Strecke zum Wischen, Ziehen mit der Maus oder Blättern mit den Pfeilen; jede Karte führt zum Projekt.
8. **Schulungen**: Windpark-Foto mit Parallaxe, die zwei Themen als Zeilen-Links.
9. **Abschluss**: große nachtgrüne Fläche mit Foto, „Ihr Vorhaben beginnt mit einem Gespräch.“, ein Lichtkegel folgt dem Mauszeiger. Danach der Footer mit dem Markennamen über die volle Inhaltsbreite.

### Unterseiten

Alle Unterseiten beginnen mit `PageHero`: kleine Zeile mit dem Seitennamen, große Überschrift über die volle Breite, Einleitung in der rechten Hälfte, darunter (außer Kontakt, Rechtstexten und Referenzen) ein breites Foto mit Parallaxe.

- **Leistungen** „Drei Bereiche, ein Konzept.“: Sprungmarken zu den drei Bereichen; je Bereich ein Foto, das neben dem Text stehen bleibt, Kernaussage, Text, „Was dazugehört“ und „Dazu beraten lassen“ mit Interessen-Vorauswahl. Nach Photovoltaik das Schaubild „So wird aus Sonne Strom.“ auf Nachtgrün.
- **Referenzen** „Aus Ideen werden Anlagen.“: die vier Projekte als große Zeilen mit je zwei Originalfotos (das kleinere überlappt die Ecke des großen), Kennwerten und „Projekt entdecken“. Fotos und Button öffnen die Galerie (`Lightbox`: natives `<dialog>`, Pfeiltasten, Vorschaubilder, Wischen, Fokus kehrt zum Auslöser zurück). Darunter „Weitere Einblicke“: zwei gegenläufige Laufbänder mit Fotos weiterer Anlagen aus dem Portfolio, dann der Download des vollständigen PDFs.
- **Über uns** „Sorgfältig geplant, praktisch umgesetzt.“: Gründer mit zwei Kennzahlen, internationale Arbeit mit den drei Standorten laut Portfolio (auf Nachtgrün), sechs Kooperationen als nummerierte Liste, drei Messefotos (öffnen die Galerie), die drei Fragen des Ansatzes, die drei Schritte mit gezeichneter Verbindungslinie.
- **Schulungen** „Wissen für die Energiewende.“: die zwei Themen als Karten mit „Schulung anfragen“, darunter die fünf dokumentierten Kurse und Weiterbildungen mit ihren Fotos (öffnen die Galerie).
- **Kontakt** „Sprechen wir über Ihr Vorhaben.“: das Formular in drei Schritten und eine Begleitspalte mit Ablauf und häufigen Fragen, die auf dem Desktop mitläuft.
- **Impressum, Datenschutz, 404**: Entwürfe bzw. Hinweisseite im selben Aufbau.

## Gestaltung

Leitgedanke: Tageslicht, Landschaft, Technik. Große Fotos in gerundeten Rahmen tragen die Seite, die Schrift ist groß und knapp, dunkle Flächen sind ebenfalls gerundete Rahmen mit etwas Abstand zum Fensterrand. Bewegung zeigt, was zusammengehört und was als Nächstes kommt; sie ist Zugabe und nie Voraussetzung.

**Farben** (`src/styles/tokens.css`): Papierweiß `#F4F5EF` als Grund, Weiß für Karten, Waldgrün `#173E2B` für Überschriften und Buttons, Nachtgrün `#0D2217` für dunkle Flächen und den Footer, Blattgrün `#2B7A4B` für Punkte und Linien, Nebelgrün `#E7ECE1` für ruhige Flächen und als einziger Akzent Sonnengrün `#D3EE6B` (nur als Fläche mit dunkler Schrift oder auf Nachtgrün). Kontraste (WCAG 2):

| Paarung | Kontrast | Verwendung |
| --- | --- | --- |
| Ink `#1A2920` auf Papierweiß | 13,9:1 | Fließtext |
| Ink 2 `#48594E` auf Papierweiß / Nebelgrün | 6,8:1 / 6,2:1 | Sekundärtext |
| Waldgrün auf Papierweiß | 10,9:1 | Überschriften |
| Weiß auf Waldgrün | 11,9:1 | Primärbuttons, aktive Navigation |
| Nachtgrün auf Sonnengrün | 12,9:1 | Akzentbuttons, Marken, Pfeile |
| Papierweiß / `#B7C8BA` auf Nachtgrün | 15,2:1 / 9,5:1 | Text auf dunklen Flächen |
| `#256A42` auf Papierweiß | 6,0:1 | Kleine grüne Texte |
| `#74887A` auf Weiß / Papierweiß | 3,8:1 / 3,5:1 | Formularrahmen; Überschriften der gerade nicht aktiven Ablauf-Schritte (große Schrift) |
| `#9E3A2C` auf Weiß | 6,8:1 | Fehlertexte |
| Weiß auf Hero-Foto | Überschrift 5,1:1 (mobil 4,3:1), Satz 11,1:1 (mobil 7,9:1) | gemessen am hellsten 8×8-px-Block hinter dem Text |
| Papierweiß auf Abschluss-Foto | 6,5:1 | ebenso gemessen |

Die großen Konturziffern (Referenzen, 404) und der Markenname im Footer sind reine Zierde: Sie stehen nicht im Dokument, sondern kommen per CSS aus `data-text`.

**Schrift:** Bricolage Grotesque (Überschriften, Gewicht 600, mit optischer Größe) und Geist (Text und Bedienelemente) als variable Fonts, lokal unter `public/fonts/` (Latin und Latin Extended aus den Fontsource-Paketen, SIL Open Font License; Deklarationen in `src/styles/fonts.css`). Die beiden Latin-Dateien werden in `index.html` vorgeladen; Fallback-Schnitte mit den in Chrome gemessenen Maßen (`size-adjust`, `ascent-override`) halten den Umbruch beim Nachladen stabil. Auf schmalen Bildschirmen trennen lange Wörter im Fließtext an der Silbe (`hyphens: auto`), größer gesetzter Text nicht.

**Bewegung** (alles CSS plus zwei kleine Hooks, keine Bibliothek):

| Baustein | Verhalten | Ohne Bewegung / ohne JavaScript |
| --- | --- | --- |
| Einstieg der Seiten | Überschrift steigt Wort für Wort auf, Foto fährt aus einer Vergrößerung zurück; läuft als CSS-Animation mit dem ersten Bild | sofort sichtbar |
| `data-reveal` | Einblenden beim Sichtbarwerden: Text von unten, Fotos öffnen sich von unten, Überschriften Wort für Wort, Gruppen nacheinander | sofort sichtbar; ausgeblendet wird erst, wenn feststeht, was im Bild ist |
| `data-parallax` | Foto wandert im Rahmen mit der Scrollposition | Foto steht |
| Leitsatz, Linie im Ablauf (`data-scrub`) | folgen dem Scrollfortschritt | fertiger Zustand |
| Kopfleiste | weicht beim Scrollen nach unten aus, kehrt beim Scrollen nach oben, bei Tastaturfokus und offenem Menü zurück; Navigation mit gleitender Markierung | ohne Übergang |
| Laufbänder | laufen endlos; anhalten per Schalter, Mauszeiger oder Fokus | stehen, von Hand verschiebbar |
| Referenzkarte im Hero | wechselt alle sechs Sekunden; Schalter zum Anhalten, Segmente zur Direktwahl | wechselt nicht |
| Kennzahlen | zählen einmal hoch | zeigen den Wert |
| Bildflächen, Ablauf, Referenzstrecke, Galerie | reagieren auf Zeiger, Fokus, Scrollen, Tasten | funktionieren ohne Übergänge; ohne JavaScript bleiben alle Inhalte lesbar und alle Links erreichbar |
| Seitenwechsel | neuer Inhalt blendet kurz ein (nicht beim ersten Laden) | ohne Einblendung |

Dauerhaft bewegte Inhalte (Laufbänder, Referenzkarte) haben eine Pause-Möglichkeit; alles andere endet von selbst. Kein Scroll-Hijacking: Die Seite scrollt nativ.

## Bilder

`src/config/images.json` beschreibt jede Variante der Stockfotos: Quelldatei, Seitenverhältnis, Breiten, Fokuspunkt, optionaler Zoom, Alt-Text und Bildnachweis. `npm run images` erzeugt daraus AVIF-, WebP- und JPEG-Varianten in `public/images/` (AVIF Qualität 62, WebP 80, JPEG 82), löscht Varianten ohne Manifest-Eintrag (nur Dateien dieses Ordners, keine Unterordner) und schreibt `public/images/SOURCES.md`. Die `Picture`-Komponente liest dieselbe Datei und setzt `srcset`, `sizes`, `width`/`height`, Lazy Loading und über `art` einen zweiten Zuschnitt ab einer Media Query. Die Bildnachweise erscheinen automatisch im Impressum unter „Bildnachweise“.

| Eintrag | Original | Zuschnitt | Verwendung |
| --- | --- | --- | --- |
| `hero`, `hero-hoch` | `haeuser.jpg` | 16:10 bis 2560 px bzw. 3:5 (unter 700 px) | Hero der Startseite |
| `pv-panel` | `pv-dach.jpg` | 5:4 | Bildfläche und Abschnitt Photovoltaik |
| `pflege-panel` | `reinigung.jpg` | 5:4 | Bildfläche und Abschnitt Betrieb & Pflege |
| `technik-panel` | `heizung.jpg` | 5:4 | Bildfläche und Abschnitt Gebäudetechnik |
| `prozess-1` | `gewerbedach.jpg` | 4:5 | Ablauf, Schritt 1 |
| `prozess-2` | `haus.jpg` | 4:5 | Ablauf, Schritt 2 |
| `prozess-3` | `montage-ppe.jpg` | 4:5 | Ablauf, Schritt 3 |
| `wind`, `wind-breit` | `training.jpg` | 16:10 bzw. 21:9 | Schulungen auf der Startseite; Bildband Schulungsseite |
| `montage-breit` | `dach-nl.jpg` | 21:9 | Bildband „Über uns“ |
| `leistungen` | `ziegelbau.jpg` | 21:9 | Bildband Leistungsseite; Abschluss der Startseite |
| `og` | `haeuser.jpg` | 1200 × 630 | `og:image` |

Originale der Stockfotos (in `assets-src/`, per `.gitignore` ausgeschlossen; Download-Quellen stehen in `images.json` und `SOURCES.md`):

| Datei | Motiv | Urheber | Lizenz |
| --- | --- | --- | --- |
| `haeuser.jpg` | Reihe moderner Giebelhäuser mit Photovoltaikdächern | Budget Bizar (Pexels) | Pexels-Lizenz |
| `pv-dach.jpg` | Wohnhaus mit Photovoltaik auf dem Ziegeldach, Hecken | Watt A Lot (Unsplash) | Unsplash-Lizenz |
| `reinigung.jpg` | Modulreinigung mit rotierender Bürste | Florida Solar Fix (Unsplash) | Unsplash-Lizenz |
| `heizung.jpg` | Techniker am Heizkreisverteiler | Marc Zeman (Unsplash) | Unsplash-Lizenz |
| `haus.jpg` | Wohnhaus mit dachintegrierter Photovoltaik, Rijswijk | Nanda Sluijsmans (Wikimedia Commons) | CC BY-SA 2.0, Namensnennung erforderlich |
| `montage-ppe.jpg` | Monteur mit Helm, Warnweste und Handschuhen verschraubt ein Modul | Gustavo Fring (Pexels) | Pexels-Lizenz |
| `dach-nl.jpg` | Monteur installiert Module auf dem Ziegeldach eines Reihenhauses | Stefan de Vries (Pexels) | Pexels-Lizenz |
| `training.jpg` | Windpark Schöppinger Berg, NRW | Dietmar Rabich (Wikimedia Commons) | CC BY-SA 4.0, Namensnennung erforderlich |
| `gewerbedach.jpg` | Techniker auf einem großen Photovoltaikdach | Hoan Ngọc (Pexels) | Pexels-Lizenz |
| `ziegelbau.jpg` | Ziegelgebäude mit großer Photovoltaik-Dachfläche zwischen Bäumen | Watt A Lot (Unsplash) | Unsplash-Lizenz |

`assets-src/detail.jpg` (Montageschiene, Jimmy Nilsson Masth, Unsplash) wird seit dem Redesign nicht mehr verwendet und steht nicht mehr im Manifest. Stockfotos zeigen keine Projekte, Mitarbeitenden oder Kundinnen und Kunden von GLE; die Fotos der Referenzen, Messen und Kurse dagegen sind Originalaufnahmen aus dem Portfolio (`public/images/portfolio/`, Quelle und Zuordnung in der dortigen `SOURCES.md` und in `portfolio-images.json`) und auf der Startseite als „Referenz · Ort“ gekennzeichnet. Für das Redesign wurden keine neuen Fotos beschafft: Die vorhandenen Originale sind neu zugeschnitten und anders präsentiert, die Projektfotos stehen stärker im Vordergrund. Von gle.az, solarisandmore.de und enphase.com wurden keine Bilder oder Texte übernommen. Eigene, hochauflösende Projektfotos sollten zuerst das Hero-Motiv und die drei Ablauf-Fotos ersetzen: Datei in `assets-src/` ablegen, `images.json` anpassen, `npm run images` ausführen.

## Kontaktformular anbinden

Das Formular (`ContactForm`) ist eine Anfrage in drei Schritten auf einer weißen Karte: „Ihr Vorhaben“ mit den Auswahl-Chips „Worum geht es?“ (Pflicht; sechs Werte aus `contact.ts`, darunter die beiden Schulungen) und „Für welches Gebäude?“ (optional, bei Schulungen ausgeblendet), dann „Ihre Kontaktdaten“ und „Ihre Nachricht“. Sobald das Interesse gewählt ist, erscheint ein Satz in Alltagssprache („Eine neue Photovoltaikanlage für Ihr Wohnhaus.“) und „Auswahl zurücksetzen“, das den Fokus auf die Schrittüberschrift setzt. Links mit `?interesse=…` (optional `&gebaeude=…`) von Leistungs- und Schulungsseite wählen den Chip vor; ein solcher Link geht einem gemerkten Interesse vor, überschreibt aber nie, was der Besucher danach selbst wählt. Der Gebäudetyp wird als optionales Feld `building` an den Adapter übergeben.

Der ganze Entwurf (Auswahl und Texte) wird unter dem Schlüssel `gle.anfrage` im `sessionStorage` gemerkt und nach einem Seitenwechsel oder Neuladen wiederhergestellt, bis ein echter Versand ihn löscht; übertragen wird dabei nichts. Das Formular validiert clientseitig, zeigt Fehler inline und als Zusammenfassung mit Sprunglinks, setzt den Fokus auf die erste fehlerhafte Angabe und begrenzt die Feldlängen. Das Ergebnis nach dem Absenden erscheint als deutlich abgesetzte Tafel, die den Fokus erhält.

Im Prototyp ist der **Demo-Adapter** aktiv: Es wird nichts übertragen, und die Oberfläche sagt das vor und nach dem Absenden ausdrücklich. Eine Erfolgsmeldung erscheint nur, wenn ein echter Adapter `{ kind: 'sent' }` zurückgibt. Anbindung: In `src/lib/contact/adapter.ts` einen Adapter implementieren (Beispiel als Kommentar enthalten), der die Anfrage an einen eigenen Endpunkt oder einen Formulardienst sendet, und `contactAdapter` darauf umstellen. Anschließend den Abschnitt „Kontaktformular“ in der Datenschutzerklärung um Empfänger, Dienstleister und Speicherdauer ergänzen.

## Routing und Hosting

Die Seite hat saubere Pfade (`/leistungen`, `/kontakt` …). `npm run build` rendert jede Route vor (`scripts/prerender.mjs`): `dist/` enthält pro Route `leistungen/index.html` und zusätzlich `leistungen.html`, damit sowohl Hosts mit Verzeichnis-Index (nginx, Apache, S3) als auch solche mit Clean URLs (Vercel, Netlify, GitHub Pages, `vite preview`) ohne Konfiguration funktionieren; unbekannte Pfade bekommen `404.html`. Der Browser zeigt eine Seite damit vor dem JavaScript, Suchmaschinen lesen sie ohne Skript, und React übernimmt das fertige HTML (Hydration). Liefert ein Host für einen unbekannten Pfad die Startseite aus, erkennt `src/main.tsx` das am Attribut `data-route` und baut die Seite neu auf. Eine Umschreibung aller Pfade auf `index.html` ist nicht nötig; sinnvoll bleibt, `404.html` für unbekannte Pfade auszuliefern (Netlify und GitHub Pages tun das von selbst, nginx: `error_page 404 /404.html;`). Im Entwicklungsmodus (`npm run dev`) wird nicht vorgerendert.

Es wurde nichts deployt. Die Scrollposition wird bei „Zurück“/„Vor“ im Browser selbst wiederhergestellt (`history.scrollRestoration = 'manual'` plus eigene Merkliste), bei neuen Seitenaufrufen beginnt die Seite oben und der Fokus liegt auf `main`; Anker wie `/leistungen#gebaeudetechnik` springen direkt zum Abschnitt und bleiben unter der schwebenden Kopfleiste sichtbar. Jeder Verlaufseintrag wird genau einmal behandelt, damit die doppelten Effekte des React-StrictMode im Entwicklungsmodus die Position nicht überschreiben. Fokusziele erhalten `tabindex="-1"` nur vorübergehend bis zum nächsten Blur.

## Prüfung

Zuletzt durchgeführt am 17. November 2026 auf dem vorgerenderten Produktionsbuild (`npx vite preview --host 127.0.0.1 --port 4173`) in echtem, headless gestartetem Google Chrome über `playwright-core`:

- `SITE_URL=http://127.0.0.1:4173 node scripts/check-site.mjs`: **alle 369 Prüfungen bestanden**.
- `node scripts/check-portfolio.mjs`: bestanden bei 390, 768, 900, 1100 und 1440 px.

`check-site.mjs` prüft bei 390, 768 und 1440 px auf allen neun Routen (inkl. 404):

- keine Konsolenfehler, keine fehlgeschlagenen Requests, kein horizontales Überlaufen
- genau eine `h1` pro Seite, Landmarken `header`/`nav`/`main`/`footer`, `lang="de"`, beschreibende Seitentitel
- alle dargestellten Bilder geladen, jedes mit `width`/`height` und `alt`, Stockfotos als AVIF, Projektfotos als WebP, höchstens zwei sofort geladene Bilder pro Seite
- axe-core (WCAG 2.0/2.1/2.2 A und AA plus Best Practices) bei 390 und 1440 px: keine Verstöße
- Startseite: Hero-Rahmen füllt den ersten Bildschirm, Foto nie verborgen und sofort geladen, Überschrift nach dem Einstieg an ihrem Platz, Textkontrast auf dem Foto (siehe Tabelle); schwebende Kopfleiste mit Scroll-Zustand, Ausweichen und Wiederkehren; Referenzkarte mit vier Segmenten, anhaltbar, Direktwahl, bleibt angehalten; Laufband dekorativ und anhaltbar; Leitsatz nach dem Scrollen vollständig; drei Bildflächen mit je einem Link, Öffnen per Maus und Tastatur mit Fokusring um die ganze Fläche, Klick ins Foto öffnet den Abschnitt; Kennzahlen zählen auf ihre Werte und nennen die Quelle; das stehende Foto im Ablauf folgt dem Schritt; Referenzstrecke mit vier Projekten und Pfeilen; Abschluss mit Kontrast auf dem Foto
- Leistungsseite: Bildband, drei Sprungmarken, drei mitlaufende Fotos, drei Beratungslinks mit Vorauswahl, Schaubild direkt nach Photovoltaik mit drei wählbaren Knoten und `aria-pressed`, „Vereinfachte Darstellung“
- Kontaktseite: drei Schritte, Chips mit Zusammenfassung, Zurücksetzen mit Fokus, Entwurf überlebt Datenschutz-Link, „Zurück“ und Neuladen, Übergabe per Link, leere neue Sitzung, Validierung mit Fehlerzusammenfassung und Fokus, Telefonprüfung, Demo-Ergebnis ohne Erfolgsbehauptung, FAQ per Tastatur, Begleitspalte mitlaufend bzw. mobil nach dem Formular, Formularbeginn mobil nach 372 px
- Über uns und Schulungen: Bildbänder, sechs Kooperationen, drei Standorte, Messefotos öffnen die Galerie, Verbindungslinie der Schritte, fünf dokumentierte Kurse, Interessenlinks der Themen
- mobiles Menü (öffnen, `aria-expanded`, Escape mit Fokusrückgabe, Schließen nach Navigation), Skip-Link, sichtbarer Fokusring, Fokus auf `main` nach Seitenwechsel, Anker beim direkten Aufruf, gleitende Navigationsmarkierung, Kopfleiste passt bei 320 bis 1180 px
- Vorrendern: jede Route als eigenes HTML mit eigenem Titel; die Leistungsseite ist ohne JavaScript lesbar, nichts ist ausgeblendet oder beschnitten
- `prefers-reduced-motion`: alles sichtbar, kein Einstieg, Laufbänder stehen, Referenzkarte wechselt nicht, Fotos wandern nicht, kein Foto-Zoom, Kennzahlen ohne Zählen, Schaubild und Linien ohne Animation

`check-portfolio.mjs` prüft die Referenzen: vier Projekte mit je zwei Originalfotos, Galerie (Öffnen, Blättern per Button, Pfeiltasten und Vorschaubild, Umlauf, Scrollsperre, Escape, Fokusrückgabe, Klick neben den Dialog, axe im Dialog), Download des PDFs, Menü, Kopfleiste ohne Überlappung. Screenshots beider Skripte entstehen unter `SHOT_DIR` (Standard `./screenshots`, nicht versioniert).

Zusätzlich wurden alle Seiten bei 390, 768, 1024 und 1440 px Schritt für Schritt gesichtet (Scroll-Zustände, offenes Menü, Galerie auf Desktop und Telefon, Hover der Bildflächen). Daraus korrigiert: Laufweite der großen Überschriften, Abdunkelung im Hero, Umbruch der Seitenüberschriften, Überlappung der Projektfotos, Klickfläche der Bildflächen, Kontrast der gedimmten Zustände (Leitsatz, Ablauf), Silbentrennung auf schmalen Bildschirmen, Breite des Markennamens im Footer.

Bekannte Grenzen: keine Tests auf echten Geräten oder in Safari/Firefox. Verwendet werden `:has()`, `color-mix()`, einzelne Transform-Eigenschaften (`translate`, `scale`), `text-wrap: balance`, `inert` und Container-Einheiten (mit Fallback); das setzt Browser ab etwa 2023 voraus. Der Kontrast über Fotos wurde für die ausgelieferten Zuschnitte gemessen; wer Fotos tauscht, sollte `check-site.mjs` erneut laufen lassen. Die Projektfotos aus dem Portfolio sind Handyaufnahmen mit höchstens 1400 px Breite und wirken in den großen Rahmen der Referenzseite weicher als die Stockfotos. Vor dem Launch empfiehlt sich ein manueller Durchgang auf einem iPhone und in Safari.

## Vor dem Launch

Noch benötigte Angaben und Entscheidungen:

1. **Firma und Rechtsform**, Vertretungsberechtigte, ggf. Registergericht/-nummer und USt-IdNr. (`src/config/site.ts`, erscheinen im Impressum).
2. **Anschrift, Telefon, E-Mail** und Einsatzgebiet (`site.ts`; Footer, Kontaktseite und Rechtstexte zeigen sie automatisch). Die Standorte auf „Über uns“ sind Angaben aus dem Portfolio, nicht der bestätigte rechtliche Betreiber.
3. **Domain und Hosting-Anbieter** (für Datenschutzerklärung, absolute `og:image`-URL, Sitemap und die Auslieferung von `404.html`).
4. **Versandweg des Kontaktformulars** (Endpunkt oder Dienst) und darauf abgestimmter Datenschutz-Abschnitt; dabei entscheiden, ob der Gebäudetyp mitgesendet werden soll.
5. **Rechtliche Prüfung** von Impressum und Datenschutzerklärung; beide sind Entwürfe mit sichtbar markierten offenen Punkten und keine Zusicherung der Rechtskonformität.
6. **Bestätigung des Leistungsumfangs**: Photovoltaik, Betrieb & Pflege und Gebäudetechnik sind aus der Referenz abgeleitet; Formulierungen in `services.ts`, die Stichworte des Laufbands (`facts.ts`), die FAQ-Antworten (`faq.ts`) und die Erklärtexte des Schaubilds (`flow.ts`) entsprechend schärfen oder streichen. Das Portfolio dokumentiert außerdem Speicher und Wärmepumpen; als Leistungen der Website sind sie weiterhin nicht genannt.
7. **Kennzahlen bestätigen** (`facts.ts`): 15+ Jahre, 400+ Systeme (eigene Angabe), 51 Zeilen der Referenzliste, 3 Länder. Sie stehen jetzt prominent auf der Startseite, jeweils mit Quellenhinweis; nichts davon ist unabhängig geprüft. Die Einträge 11 und 15 der Liste könnten dasselbe Projekt sein (siehe `PORTFOLIO-REVIEW.md`), deshalb heißt es „Einträge in der Referenzliste“, nicht „Projekte“.
8. **Schulungsangebot** bestätigen: Formate, Zielgruppen, ggf. Termine und Preise (`training.ts`).
9. **Berufsbezeichnung**: „Ingenieur“ ist in Deutschland geschützt. Die Texte vermeiden das Wort; der Markenbestandteil „Engineering“ ist Arbeitsstand und steht seit dem Redesign groß im Footer.
10. **Markenname und Logo**: Das GreenLife-Logo (Vorlage vom Betreiber, `assets-src/logo-greenlife.jpg`) ist eingebaut, als Inline-SVG in `src/components/Wordmark.tsx` (Header in Originalfarben, Footer mit heller Schrift; die Sonnenstrahlen drehen sich beim Überfahren, außer bei reduzierter Bewegung) und als Sonnen-„e“ in `public/favicon.svg`. Die Vektorfassung `assets-src/logo-greenlife.svg` wurde aus dem WhatsApp-JPEG nachgezeichnet; liegt eine Original-Vektordatei (SVG, AI, EPS, PDF) vor, sollte sie die Nachzeichnung ersetzen. Offen bleibt der Name in Texten und Seitentiteln: Dort steht weiterhin „GLE“ bzw. „Green Life Engineering“ (`site.ts`), das Logo zeigt „GreenLife“. Die Logofarben Petrol `#4E897D` und Orange `#EF7F1C` sind nicht Teil der Seitenpalette.
11. **Eigene Fotos**: hochauflösende Aufnahmen realer Anlagen für Hero, Ablauf und Leistungen; bessere Fassungen der Projektfotos, falls vorhanden. Danach `images.json` und die Bildnachweise prüfen (CC-BY-SA-Fotos benötigen die Nennung, Unsplash- und Pexels-Fotos nicht).
12. **Nutzungsrechte der Portfolio-Fotos** klären (im PDF ist keine Lizenz genannt), einschließlich erkennbarer Personen auf den Messe- und Kursfotos sowie sichtbarer Hersteller- und Hotelnamen.

Bewusst weggelassen: Solarrechner (als spätere Erweiterung vorgemerkt, ohne Referral-Link der Referenzseite), Sprachumschaltung, Kundenstimmen, Partner-Logos, Analyse-Tools, Cookie-Banner (nichts erfordert eine Einwilligung), die vollständige Liste der 51 Portfolioeinträge (auf Wunsch des Betreibers kuratiert; das PDF bleibt abrufbar).

## Portfolio

Das vom Betreiber bereitgestellte 37-seitige Portfolio von Altay Rustamov ist die Quelle aller Referenzen, Kennzahlen und Unternehmensangaben:

- redaktionelle Auswahl der vier Projekte: `src/config/selected-references.ts`
- vollständige Transkription der Referenzliste: `src/config/references.ts`
- Texte zu Gründer, Standorten, Kooperationen, Messen und Kursen: `src/config/company.ts`
- Fotos: `public/images/portfolio/`, Zuordnung zu den PDF-Seiten: `src/config/portfolio-images.json`
- Original-PDF: `public/documents/altay-rustamov-portfolio.pdf`
- vollständige Inhaltszuordnung und widersprüchliche Quellangaben: `PORTFOLIO-REVIEW.md`

Projektbeteiligungen in Deutschland und Aktivitäten von GLE LLC in Aserbaidschan werden im Portfolio-Kontext beschrieben. Die Angaben zum rechtlichen Betreiber und die tatsächliche Kontaktformular-Anbindung bleiben vor dem Launch zu ergänzen.
