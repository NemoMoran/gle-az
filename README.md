# GLE · Green Life Engineering, Website-Prototyp

Lokaler Prototyp einer deutschsprachigen Website für Photovoltaik, Betrieb & Pflege, Gebäudetechnik und Schulungen. React, TypeScript und Vite, eigenes CSS mit Design-Tokens, lokal gebündelte Schriften, keine Tracking- oder Drittdienste.

Status: fertig gebaut und lokal geprüft, **nicht veröffentlicht**. Marke, Leistungsumfang, Firmendaten und Rechtstexte sind Arbeitsstand und müssen vor dem Launch bestätigt werden (siehe [Vor dem Launch](#vor-dem-launch)). Im Oktober 2026 wurde die Startseite nach `PHOTO-REDESIGN-PROMPT.md` fotografisch neu komponiert; dieses Briefing ersetzt die Gestaltungsvorgaben aus `BUILD-PROMPT.md` und `UPGRADE-PROMPT.md`, wo sie sich widersprechen. Im November 2026 folgte nach einer Design-Kritik (Protokoll unter `.impeccable/critique/`) eine Überarbeitung: vorgerenderte Routen, lokal gehostete Schriften ohne Layoutsprung, die Kontaktseite als ein Formular in drei Schritten, neue Kompositionen für Bildmotiv, „Über uns“ und Leistungen sowie Navigation und mobiles Menü.

Die Briefing-Dateien `BUILD-PROMPT.md`, `REFERENCE-REVIEW.md`, `UPGRADE-PROMPT.md`, `PHOTO-REDESIGN-PROMPT.md` und `CLAUDE.md` bleiben als Projektgrundlage erhalten.

## Schnellstart

Voraussetzung: Node.js 20.19 oder neuer (getestet mit Node 24).

```sh
cd /Users/muradayvaz/Documents/ChatGPT/gle-az
npm install
npm run dev
```

Die Seite läuft dann unter <http://127.0.0.1:5173/>. Produktionsbuild und Vorschau:

```sh
npm run build      # Typprüfung + Build nach dist/
npm run preview    # dist/ lokal ausliefern (http://localhost:4173/)
```

Hinweis: Unter Node 24 bindet `vite preview` an `localhost` (IPv6). Wer die Vorschau unter `127.0.0.1` braucht, etwa für `scripts/check-site.mjs`, startet sie mit `npx vite preview --host 127.0.0.1 --port 4173`.

## Skripte

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | `tsc --noEmit`, `vite build` nach `dist/` und Vorrendern aller Routen (`scripts/prerender.mjs`) |
| `npm run preview` | Produktionsbuild lokal ausliefern |
| `npm run typecheck` | Nur Typprüfung |
| `npm run images` | Fotos aus `assets-src/` nach `public/images/` zuschneiden (AVIF, WebP, JPEG) und `SOURCES.md` schreiben |
| `node scripts/check-site.mjs` | Browser-Prüfung gegen eine laufende Instanz (siehe [Prüfung](#prüfung)) |

## Struktur

```
index.html                  HTML-Hülle, Metadaten, Platzhalter für das vorgerenderte HTML
src/main.tsx                Einstieg im Browser: übernimmt vorgerendertes HTML (Hydration) oder rendert neu
src/entry-server.tsx        Einstieg für das Vorrendern im Build
src/App.tsx                 Routen
src/components/             Header mit SiteNav, Footer, Picture (AVIF/WebP/JPEG), ButtonLink, ArrowLink,
                            ServiceCards (Startseite), ConsultationCta (mit optionalem Foto),
                            EnergyFlow (Leistungsseite), ContactForm und Faq (Kontakt),
                            Disclosure, ProcessSteps (Über uns), PageHead, Draft, Wordmark
src/pages/                  Startseite, Leistungen, Über uns, Schulungen, Kontakt, Impressum, Datenschutz, 404
src/config/                 Alle änderbaren Inhalte und Stammdaten (siehe unten)
src/lib/contact/adapter.ts  Versandadapter des Kontaktformulars (Demo)
src/lib/vorhaben.ts         Schritt „Ihr Vorhaben“: Prüfung der Werte, Zusammenfassung, gemerkter Entwurf
src/lib/                    Seitentitel, Einblendungen, Media Queries, Bildmanifest
src/styles/                 fonts.css, tokens.css, base.css, components.css, pages.css
public/fonts/               Manrope und Source Sans 3 (variabel, Latin und Latin Extended, OFL)
public/images/              Erzeugte Bildvarianten + SOURCES.md (Bildquellen)
assets-src/                 Originalfotos (nicht im Repository, siehe Bilder)
scripts/optimize-images.mjs Bildpipeline (sharp)
scripts/prerender.mjs       Vorrendern aller Routen nach dist/ (Teil von npm run build)
scripts/check-site.mjs      Browser-Prüfung (playwright-core + axe-core, nutzt installiertes Chrome)
```

## Inhalte anpassen

Alle Texte, die der Betreiber voraussichtlich ändern will, liegen zentral in `src/config/`:

| Datei | Inhalt |
| --- | --- |
| `site.ts` | Markenname, Firmen- und Rechtsdaten, Anschrift, Telefon, E-Mail, Einsatzgebiet, Domain. Alles, was `null` ist, wird ausgeblendet oder in den Rechtstexten sichtbar als offen markiert. |
| `services.ts` | Die drei Leistungsgruppen: Kartensatz und Foto für die Startseite, Absätze und Liste für die Leistungsseite. Umfang ist unbestätigt und bewusst ohne Wallbox, Speicherverkauf, Wärmepumpen-Installation oder Windkraft im Großmaßstab. |
| `training.ts` | Die zwei Schulungsthemen, ohne Termine, Preise, Zertifikate oder Partner. |
| `process.ts` | Die drei Schritte auf der Seite „Über uns“. |
| `faq.ts` | Die vier häufigen Fragen auf der Kontaktseite; Antworten bleiben im Rahmen des beschriebenen Leistungsumfangs. |
| `flow.ts` | Beschriftungen und Erklärtexte des Schaubilds „So wird aus Sonne Strom.“ auf der Leistungsseite. |
| `contact.ts` | Auswahl-Chips des Schritts „Ihr Vorhaben“ im Kontaktformular: „Worum geht es?“ (Pflicht) und „Für welches Gebäude?“ (optional). |
| `navigation.ts` | Haupt- und Rechtsnavigation. |
| `images.json` | Bildzuschnitte, Alt-Texte und Bildnachweise. |

Die Sätze der Zusammenfassung im Kontaktformular („Eine neue Photovoltaikanlage für Ihr Wohnhaus.“) stehen in `src/lib/vorhaben.ts`. Die kurzen Sätze der Startseite und die Texte von „Über uns“ und den Rechtstexten stehen direkt in den Seitenkomponenten unter `src/pages/`.

## Startseite

Die Startseite ist fotografisch aufgebaut: sechs Abschnitte, neun verschiedene Fotos, sieben Sätze Fließtext. Jeder Abschnitt hat eine Überschrift, höchstens zwei Sätze und eine Aktion.

1. **Hero.** Foto über die volle Breite (Reihe moderner Häuser mit Photovoltaikdächern), links eine abgedunkelte Zone mit weißer Überschrift „Erneuerbare Energie für Ihr Gebäude.“, dem Satz „Photovoltaik, Betrieb & Pflege und Gebäudetechnik – zusammen geplant für Ihr Zuhause oder Ihr Unternehmen.“, „Beratung anfragen“ und dem Textlink „Leistungen entdecken“. Höhe auf dem Desktop 560 bis 680 px (72 % der Fensterhöhe); mobil bestimmt der Inhalt die Höhe, das Foto liegt in einem eigenen Hochformat-Zuschnitt dahinter. Überschrift, Satz und Aktionen erscheinen nacheinander (550 ms, 70 ms Versatz); das Foto wird nie verzögert.
2. **Drei Bildkarten** (`ServiceCards`): Photovoltaik, Betrieb & Pflege, Gebäudetechnik, gleichzeitig sichtbar, mit je einem eigenen Foto (etwa zwei Drittel der Karte), einem Satz und „Mehr erfahren“. Die ganze Karte ist der Link zum bestehenden Anker auf der Leistungsseite; beim Hover zoomt das Foto um 3 %, der Tastaturfokus umrahmt die ganze Karte. Mobil stapeln die Karten.
3. **Bildmotiv** „Energie vom eigenen Dach.“: Panoramafoto eines Wohnhauses mit dachintegrierter Anlage über die volle Breite, darunter bündig eine zweispaltige Zeile mit der Überschrift links sowie einem Satz und „Photovoltaik entdecken“ rechts; nichts überlappt das Foto.
4. **Ablauf** „Von der Idee bis zur Umsetzung.“: zwei versetzte Fotos (Monteur mit Schutzausrüstung auf einem großen Photovoltaikdach, Detail einer Montageschiene), zwei Sätze, die Begriffe „Beraten. Planen. Umsetzen.“ und der Link „Mehr über uns“. Die Fotos zeigen Stockmotive, nicht das Team von GLE; die Alt-Texte sagen das nicht anders.
5. **Schulungen** „Wissen für die Energiewende.“: Text links, Windpark-Foto rechts bis zum Rand, „Schulungen entdecken“.
6. **Abschluss** „Ihr Vorhaben beginnt mit einem Gespräch.“: Foto eines großen Photovoltaikdachs, abgedunkelt nur hinter dem Text wie im Hero (rechts bleibt das Foto sichtbar), „Beratung anfragen“, danach der Footer.

Verschoben, nicht gestrichen: Das Schaubild „So wird aus Sonne Strom.“ ist ein eigener Abschnitt auf Nebelgrün auf der Leistungsseite, direkt nach Photovoltaik. Die zwei Fragen der früheren Projektauswahl sind der erste Schritt des Kontaktformulars; die häufigen Fragen stehen in der Begleitspalte daneben. Die drei Schritte mit der gezeichneten Verbindungslinie stehen auf „Über uns“. Die Schulungsinhalte stehen vollständig auf der Schulungsseite; die Aufklapp-Zeilen der Startseite und der Tab-Explorer entfallen.

Weitere Seiten: Leistungen zeigt je Leistungsgruppe ein breites Foto (Ziegelgebäude mit großer Photovoltaik-Dachfläche, Modulreinigung, Heizkreisverteiler), darunter Titel und Text in zwei Spalten, die von Bereich zu Bereich die Seite wechseln, sowie „Dazu beraten lassen“ mit Interessen-Vorauswahl. Über uns beginnt mit dem Bildband, danach „Unser Ansatz“ mit den drei Fragen, mit denen jede Planung beginnt („Wie wird das Gebäude genutzt?“, „Wie viel Energie braucht es?“, „Was soll sich verändern?“), den drei Schritten und „Wissen weitergeben“. Schulungen hat ein Bildband. Die Kontaktseite besteht aus dem Formular in drei Schritten und einer Begleitspalte mit Ablauf und häufigen Fragen, die auf dem Desktop beim Scrollen mitläuft; mobil folgt sie dem Formular.

## Gestaltung

Leitgedanke seit dem Foto-Redesign: Große Fotografien und ihre Komposition tragen die Seite, Text bleibt kurz, Flächen sind weiß. Kein Hero-Karussell, keine Projektgalerie mit Stockfotos, keine erfundenen Kennzahlen, kein Scroll-Hijacking, keine Zähler, keine Dauerbewegung. Zwischen den Abschnitten wechseln sich breite Fotos, Bildkarten und knappe weiße Abschnitte ab; blasse Flächenbänder gibt es nicht mehr.

Farben (`src/styles/tokens.css`): Waldgrün `#173E2B` für Überschriften, dunkle Flächen und den Footer; Blattgrün `#2B7A4B` für Buttons, Akzente und den Fokusring; Weiß als Fläche; Nebelgrün `#EAF0E8` nur noch für Hinweise und Hover-Zustände. Himmel, Vegetation und warme Töne kommen aus den Fotos. Abdunkelungen über Fotos (Hero links, Abschluss) sind Farbverläufe aus Waldgrün; sie sind funktional und bewusst erlaubt. Kontraste:

| Paarung | Kontrast | Verwendung |
| --- | --- | --- |
| Ink `#202C25` auf Weiß | 14,3:1 | Fließtext |
| Waldgrün auf Weiß | 12,0:1 | Überschriften |
| Weiß auf Waldgrün | 12,0:1 | Abschluss, Footer, gewählte Chips und Knoten |
| Weiß auf Blattgrün `#2B7A4B` | 5,3:1 | Primärbuttons |
| `#256A42` (Leaf-Text) auf Weiß | 6,6:1 | Kleine grüne Texte („Mehr erfahren“) |
| `#4A5B50` (Ink 2) auf Weiß | 7,2:1 | Sekundärtext |
| `#C9DBCE` auf Waldgrün | 8,3:1 | Sekundärtext auf Grün |
| `#7E927F` auf Weiß | 3,3:1 | Formularrahmen, Linien im Schaubild |
| `#9E3A2C` auf Weiß | 6,8:1 | Fehlertexte |
| Weiß auf Hero-Foto mit Abdunkelung | 5,1:1 (Desktop), 5,4:1 (Mobil) | Hero-Überschrift und -Satz, gemessen am hellsten 8×8-px-Block hinter dem Text |
| Weiß auf Abschluss-Foto mit Abdunkelung | 5,8:1 | Abschluss-Überschrift, ebenso gemessen |

Schriften: Manrope (Überschriften, Gewicht 700) und Source Sans 3 (Text) als variable Fonts, lokal unter `public/fonts/` (Latin und Latin Extended, ursprünglich aus den Fontsource-Paketen, SIL Open Font License; Deklarationen in `src/styles/fonts.css`). Die beiden Latin-Dateien werden in `index.html` vorgeladen, und Fallback-Schnitte mit den in Chrome gemessenen Maßen der Webfonts (`size-adjust`, `ascent-override`) sorgen dafür, dass sich beim Nachladen nichts verschiebt. Überschriften sind kürzer und größer als zuvor: Hero 72 px auf dem Desktop, 39 px bei 390 px Breite, Abschnittsüberschriften 30 bis 44 px, Laufweite −0,02 em. Keine langen Versalzeilen, keine Kicker über Überschriften.

Bewegung: Bedienelemente 150 ms, Fotos blenden beim Sichtbarwerden einmal aus einer leichten Vergrößerung ein (700 ms), Textblöcke in 500 ms mit 14 px Versatz; Kartenfotos zoomen beim Hover auf 1,03; Pfeile in Buttons rücken 3 px. In der Hauptnavigation gleitet eine weiße Fläche dem Mauszeiger nach, eine waldgrüne markiert die aktuelle Seite und gleitet beim Seitenwechsel zum neuen Eintrag (250 ms); im mobilen Menü erscheinen die Einträge nacheinander (40 ms Versatz); das Menü füllt die Seite unter dem Header, sperrt das Scrollen und macht die Seite dahinter inert. Die Einblendung beim Scrollen blendet erst aus, wenn feststeht, was gerade im Bild ist: Vorgerenderte Inhalte bleiben bis dahin sichtbar, und was schon zu sehen ist, verschwindet nie. Alles per CSS, die Navigation misst nur die Linkpositionen per Script, keine Animationsbibliothek. Bei `prefers-reduced-motion` entfallen das Gleiten in der Navigation, der Einstieg, Einblendungen, Zoom, Linien- und Flussanimation; Inhalte und Zustandswechsel bleiben sichtbar.

## Bilder

`src/config/images.json` beschreibt jede Bildvariante: Quelldatei, Seitenverhältnis, Breiten, Fokuspunkt, optionaler Zoom, Alt-Text und Bildnachweis (Titel, Urheber mit Profil-Link, Lizenz, Quelle). Mehrere Einträge dürfen dasselbe Original unterschiedlich zuschneiden. `npm run images` erzeugt daraus AVIF-, WebP- und JPEG-Varianten in `public/images/` (AVIF Qualität 62, WebP 80, JPEG 82), löscht Varianten ohne Manifest-Eintrag und schreibt `public/images/SOURCES.md`. Die `Picture`-Komponente liest dieselbe Datei und setzt `srcset`, `sizes`, `width`/`height`, Lazy Loading (nur das Hero-Foto lädt sofort mit hoher Priorität) und über `art` einen zweiten Zuschnitt ab einer Media Query. Die Bildnachweise erscheinen automatisch im Impressum unter „Bildnachweise“.

| Eintrag | Original | Zuschnitt | Verwendung |
| --- | --- | --- | --- |
| `hero`, `hero-hoch` | `haeuser.jpg` | 16:9 bis 2400 px bzw. 4:5 (unter 700 px) | Hero |
| `pv` | `pv-dach.jpg` | 4:3 | Karte Photovoltaik |
| `pflege`, `pflege-breit` | `reinigung.jpg` | 4:3 bzw. 5:2 bis 2400 px | Karte Betrieb & Pflege; Band auf der Leistungsseite |
| `technik`, `technik-breit` | `heizung.jpg` | 4:3 bzw. 5:2 bis 2400 px | Karte Gebäudetechnik; Band auf der Leistungsseite |
| `haus-panorama` | `haus.jpg` | 21:9 bis 2400 px | Bildmotiv „Energie vom eigenen Dach.“ |
| `montage` | `montage-ppe.jpg` | 4:3 | Ablauf, großes Foto |
| `detail` | `detail.jpg` | 1:1 | Ablauf, kleines Foto |
| `wind`, `wind-breit` | `training.jpg` | 16:10 bzw. 21:9 | Schulungs-Teaser; Bildband Schulungsseite |
| `abschluss` | `gewerbedach.jpg` | 21:9, Zoom 0,6, rechter Bildteil | Abschluss der Startseite |
| `montage-breit` | `dach-nl.jpg` | 21:9 | Bildband „Über uns“ |
| `leistungen` | `ziegelbau.jpg` | 21:9 | Band Photovoltaik auf der Leistungsseite, zugleich der fotografische Einstieg |
| `og` | `haeuser.jpg` | 1200 × 630 | `og:image` |

Originale (in `assets-src/`, per `.gitignore` ausgeschlossen; Download-Quellen stehen in `images.json` und `SOURCES.md`):

| Datei | Motiv | Urheber | Lizenz |
| --- | --- | --- | --- |
| `haeuser.jpg` | Reihe moderner Giebelhäuser mit Photovoltaikdächern | Budget Bizar (Pexels) | Pexels-Lizenz |
| `pv-dach.jpg` | Wohnhaus mit Photovoltaik auf dem Ziegeldach, Hecken | Watt A Lot (Unsplash) | Unsplash-Lizenz |
| `reinigung.jpg` | Modulreinigung mit rotierender Bürste | Florida Solar Fix (Unsplash) | Unsplash-Lizenz |
| `heizung.jpg` | Techniker am Heizkreisverteiler | Marc Zeman (Unsplash) | Unsplash-Lizenz |
| `haus.jpg` | Wohnhaus mit dachintegrierter Photovoltaik, Rijswijk | Nanda Sluijsmans (Wikimedia Commons) | CC BY-SA 2.0, Namensnennung erforderlich |
| `montage-ppe.jpg` | Monteur mit Helm, Warnweste und Handschuhen verschraubt ein Modul | Gustavo Fring (Pexels) | Pexels-Lizenz |
| `dach-nl.jpg` | Monteur installiert Module auf dem Ziegeldach eines Reihenhauses | Stefan de Vries (Pexels) | Pexels-Lizenz |
| `detail.jpg` | Hand befestigt eine Montageschiene auf Dachziegeln | Jimmy Nilsson Masth (Unsplash) | Unsplash-Lizenz |
| `training.jpg` | Windpark Schöppinger Berg, NRW | Dietmar Rabich (Wikimedia Commons) | CC BY-SA 4.0, Namensnennung erforderlich |
| `gewerbedach.jpg` | Techniker auf einem großen Photovoltaikdach | Hoan Ngọc (Pexels) | Pexels-Lizenz |
| `ziegelbau.jpg` | Ziegelgebäude mit großer Photovoltaik-Dachfläche zwischen Bäumen | Watt A Lot (Unsplash) | Unsplash-Lizenz |

Unsplash- und Pexels-Lizenz erlauben die kommerzielle Nutzung ohne Namensnennung; die Urheber werden trotzdem im Impressum genannt. Die beiden Commons-Fotos verlangen die Nennung. Auswahlkriterien waren Motivvielfalt (weite Anlage, ganzes Gebäude, Wartung, Technik, arbeitende Menschen, Nahaufnahme, Wind), natürliches Tageslicht, plausible Montage und keine erkennbaren Marken oder Herstellerfotos; Fotos aus Herstellerkonten wurden bewusst nicht verwendet. Zwei zunächst gewählte Montagefotos mit US-Schindeldächern wurden nach der Sichtung durch europäische Motive mit Schutzausrüstung ersetzt; der genaue Aufnahmeort der Stockfotos ist nicht verifiziert. Von gle.az, solarisandmore.de und enphase.com wurden keine Bilder oder Texte übernommen. Eigene Projektfotos sollten zuerst das Hero-Motiv und die beiden Montagefotos ersetzen: Datei in `assets-src/` ablegen, `images.json` anpassen, `npm run images` ausführen.

## Kontaktformular anbinden

Das Formular (`ContactForm`) ist eine Anfrage in drei Schritten auf einer weißen Karte: „Ihr Vorhaben“ mit den Auswahl-Chips „Worum geht es?“ (Pflicht; sechs Werte aus `contact.ts`, darunter die beiden Schulungen) und „Für welches Gebäude?“ (optional, bei Schulungen ausgeblendet), dann „Ihre Kontaktdaten“ und „Ihre Nachricht“. Sobald das Interesse gewählt ist, erscheint ein Satz in Alltagssprache („Eine neue Photovoltaikanlage für Ihr Wohnhaus.“) und „Auswahl zurücksetzen“, das den Fokus auf die Schrittüberschrift setzt. Links mit `?interesse=…` (optional `&gebaeude=…`) von Leistungs- und Schulungsseite wählen den Chip vor; ein solcher Link geht einem gemerkten Interesse vor, überschreibt aber nie, was der Besucher danach selbst wählt. Der Gebäudetyp wird als optionales Feld `building` an den Adapter übergeben.

Der ganze Entwurf (Auswahl und Texte) wird unter dem Schlüssel `gle.anfrage` im `sessionStorage` gemerkt und nach einem Seitenwechsel oder Neuladen wiederhergestellt, bis ein echter Versand ihn löscht; übertragen wird dabei nichts. Das Formular validiert clientseitig, zeigt Fehler inline und als Zusammenfassung mit Sprunglinks, setzt den Fokus auf die erste fehlerhafte Angabe und begrenzt die Feldlängen. Das Ergebnis nach dem Absenden erscheint als deutlich abgesetzte Tafel, die den Fokus erhält.

Im Prototyp ist der **Demo-Adapter** aktiv: Es wird nichts übertragen, und die Oberfläche sagt das vor und nach dem Absenden ausdrücklich. Eine Erfolgsmeldung erscheint nur, wenn ein echter Adapter `{ kind: 'sent' }` zurückgibt. Anbindung: In `src/lib/contact/adapter.ts` einen Adapter implementieren (Beispiel als Kommentar enthalten), der die Anfrage an einen eigenen Endpunkt oder einen Formulardienst sendet, und `contactAdapter` darauf umstellen. Anschließend den Abschnitt „Kontaktformular“ in der Datenschutzerklärung um Empfänger, Dienstleister und Speicherdauer ergänzen.

## Routing und Hosting

Die Seite hat saubere Pfade (`/leistungen`, `/kontakt` …). `npm run build` rendert jede Route vor (`scripts/prerender.mjs`): `dist/` enthält pro Route `leistungen/index.html` und zusätzlich `leistungen.html`, damit sowohl Hosts mit Verzeichnis-Index (nginx, Apache, S3) als auch solche mit Clean URLs (Vercel, Netlify, GitHub Pages, `vite preview`) ohne Konfiguration funktionieren; unbekannte Pfade bekommen `404.html`. Der Browser zeigt eine Seite damit vor dem JavaScript, Suchmaschinen lesen sie ohne Skript, und React übernimmt das fertige HTML (Hydration). Liefert ein Host für einen unbekannten Pfad die Startseite aus, erkennt `src/main.tsx` das am Attribut `data-route` und baut die Seite neu auf. Eine Umschreibung aller Pfade auf `index.html` ist nicht mehr nötig; sinnvoll bleibt, `404.html` für unbekannte Pfade auszuliefern (Netlify und GitHub Pages tun das von selbst, nginx: `error_page 404 /404.html;`). Im Entwicklungsmodus (`npm run dev`) wird nicht vorgerendert.

Es wurde nichts deployt. Die Scrollposition wird bei „Zurück“/„Vor“ im Browser selbst wiederhergestellt (`history.scrollRestoration = 'manual'` plus eigene Merkliste), bei neuen Seitenaufrufen beginnt die Seite oben und der Fokus liegt auf `main`; Anker wie `/leistungen#gebaeudetechnik` springen direkt zum Abschnitt. Jeder Verlaufseintrag wird genau einmal behandelt, damit die doppelten Effekte des React-StrictMode im Entwicklungsmodus die Position nicht überschreiben. Fokusziele erhalten `tabindex="-1"` nur vorübergehend bis zum nächsten Blur.

## Prüfung

Zuletzt durchgeführt am 3. November 2026 auf dem vorgerenderten Produktionsbuild (`npx vite preview --host 127.0.0.1 --port 4179`). Die Claude-in-Chrome-Erweiterung war nicht verbunden; die Prüfung lief in echtem, headless gestartetem Google Chrome über `playwright-core` (`scripts/check-site.mjs`). Ergebnis: **alle 314 Prüfungen bestanden**.

Geprüft bei 390, 768 und 1440 px Breite auf allen acht Routen (inkl. 404):

- keine Konsolenfehler, keine fehlgeschlagenen Requests, kein horizontales Überlaufen
- genau eine `h1` pro Seite, Landmarken `header`/`nav`/`main`/`footer`, `lang="de"`, beschreibende Seitentitel
- alle Bilder geladen, jedes mit `width`/`height` und `alt`, Chrome erhält die AVIF-Variante, unterhalb des Heros wird lazy geladen
- Startseite: neun verschiedene Fotos, höchstens acht Absätze Fließtext, keine Tabs, kein Schaubild, keine Projektauswahl, keine FAQ, keine Listen
- axe-core (WCAG 2.0/2.1/2.2 A und AA plus Best Practices): keine Verstöße
- Hero: Höhe 648 px bei 1440 × 900, Foto über die volle Breite und nie verborgen, sofort geladen, weiße Überschrift 72 px (mobil 39 px), keine Bildunterschrift, Textkontrast gegen das abgedunkelte Foto 5,1:1 (Desktop) bzw. 5,4:1 (mobil) am hellsten 8×8-px-Block, mobiler Hochformat-Zuschnitt
- Header weiß mit grünem Beratungsbutton, Schattenzustand beim Scrollen, Höhe unverändert
- Bildkarten: drei gleichzeitig sichtbar, Foto 55 bis 75 % der Kartenhöhe, drei verschiedene Fotos, keine Stichpunkte, Links auf die bestehenden Anker, Zoom beim Hover, Fokusring um die ganze Karte, Klick ins Foto öffnet den Abschnitt, mobil gestapelt
- Bildmotiv mit Textzeile bündig unter dem Foto und Link zur Photovoltaik, Ablauf mit zwei (mobil überlappenden) Fotos und den drei Begriffen, Schulungs-Teaser, fotografischer Abschluss mit lokaler Abdunkelung und Kontrast 6,7:1 (Desktop) bzw. 9,7:1 (mobil)
- Leistungsseite: je ein breites Foto pro Leistungsgruppe, drei Beratungslinks mit Vorauswahl, Schaubild als eigener Abschnitt direkt nach Photovoltaik mit drei Knoten, `aria-pressed`, Erklärung folgt der Auswahl, „Vereinfachte Darstellung“
- Kontaktseite: drei Schritte, Chips mit Zusammenfassung, Zurücksetzen setzt den Fokus auf die Schrittüberschrift und bewahrt die geschriebene Nachricht, Entwurf überlebt den Datenschutz-Link, „Zurück“ und Neuladen, Link mit beiden Parametern setzt die Auswahl und behält den Entwurf, neue Sitzung beginnt leer, Schulungs-Interesse blendet die Gebäudefrage aus, Formularvalidierung mit Fehlerzusammenfassung und Fokus, Telefonprüfung, Demo-Ergebnis mit Fokus und ohne Erfolgsbehauptung, Begleitspalte sticky und ohne Foto, FAQ per Tastatur, Formularbeginn mobil innerhalb von 700 px, Begleitspalte mobil nach dem Formular
- Über uns und Schulungen: Bildbänder, Verbindungslinie der drei Schritte nach dem Sichtbarwerden gezeichnet, Interessenlinks der Schulungsthemen
- mobiles Menü: öffnen, `aria-expanded`, Schließen per Escape mit Fokusrückgabe, Schließen nach Navigation
- Tastatur: Skip-Link als erstes Tab-Ziel, sichtbarer Fokusring, Fokus auf `main` nach Seitenwechsel, Anker beim direkten Aufruf
- Vorrendern: jede Route als eigenes HTML mit eigenem Titel und `data-route`; die Leistungsseite ist ohne JavaScript lesbar, nichts ist ausgeblendet
- Hauptnavigation: die Flächen liegen auf dem jeweiligen Link, gleiten beim Seitenwechsel und folgen dem Zeiger; der Header passt bei 900, 1099 und 1100 px
- `prefers-reduced-motion`: Einstieg, Einblendungen, Foto-Zoom, Fluss- und Linienanimation deaktiviert, alle Inhalte und Zustandswechsel sichtbar

Screenshots entstehen beim Lauf im Ordner `SHOT_DIR` (Standard `./screenshots`, nicht versioniert). Ergänzend wurden in eigenen Headless-Läufen gemessen: Hydration ohne Fehler auf allen Routen (auch für den SPA-Fallback eines Hosts), keine Verschiebung beim Schriftwechsel (CLS 0 auf den Rechtstexten), kein seitliches Scrollen beim Laden, Scrollsperre und `inert` bei offenem Menü sowie die Kompositionen von Bildmotiv, „Über uns“, Leistungen und Kontakt bei 390 und 1440 px. Zusätzlich wurden alle Seiten bei 390, 768 und 1440 px gesichtet; daraus korrigiert: Reihenfolge von Foto und Abdunkelung im Abschluss, Umbruch der drei Begriffe auf schmalen Bildschirmen, Größe der Chips auf der Kontaktseite, Bildausschnitte von Abschluss und Leistungs-Einstieg. Eine zweite, unabhängige Sichtung der Screenshots ergab weitere Korrekturen: auf die Textzone begrenzte, hellere Abdunkelung im Hero und im Abschluss, neue Fotos für den Leistungs-Einstieg und beide Montagemotive, Überlappung der Collage über der Modulfläche statt über der Person, bündige Kartenlinks auf dem Tablet sowie „Was dazugehört“ und „Schulung anfragen“.

Bekannte Grenzen: keine Tests auf echten Geräten oder in Safari/Firefox; Chips und Kartenfokus nutzen `:has()`, das aktuelle Browser seit 2023 unterstützen. Der Kontrast über Fotos wurde für die ausgelieferten Zuschnitte gemessen; wer Fotos tauscht, sollte `node scripts/check-site.mjs` erneut laufen lassen. Der Design-Detektor der Impeccable-Skill lief (CLI nur im Regex-Modus, ohne Befund; im Browser bleiben Hinweise, die geprüft falsch-positiv sind: „cramped padding“ an Buttons und FAQ-Zeilen, die über Mindesthöhe bzw. inneren Button Luft haben, und das Höhenverhältnis der Kontakt-Spalten, das die mitlaufende Begleitspalte nicht berücksichtigt). Das mobile Menü nutzt `inert` und `@starting-style` (Chrome 117+, Safari 17.5+, Firefox 129+; ältere Browser zeigen es ohne Einblendung). Vor dem Launch empfiehlt sich ein kurzer manueller Durchgang auf einem iPhone und in Safari.

## Vor dem Launch

Noch benötigte Angaben und Entscheidungen:

1. **Firma und Rechtsform**, Vertretungsberechtigte, ggf. Registergericht/-nummer und USt-IdNr. (`src/config/site.ts`, erscheinen im Impressum).
2. **Anschrift, Telefon, E-Mail** und Einsatzgebiet (`site.ts`; Footer, Kontaktseite und Rechtstexte zeigen sie automatisch).
3. **Domain und Hosting-Anbieter** (für Datenschutzerklärung, absolute `og:image`-URL, Sitemap und die Auslieferung von `404.html`).
4. **Versandweg des Kontaktformulars** (Endpunkt oder Dienst) und darauf abgestimmter Datenschutz-Abschnitt; dabei entscheiden, ob der Gebäudetyp aus der Projektauswahl mitgesendet werden soll.
5. **Rechtliche Prüfung** von Impressum und Datenschutzerklärung; beide sind Entwürfe mit sichtbar markierten offenen Punkten und keine Zusicherung der Rechtskonformität.
6. **Bestätigung des Leistungsumfangs**: Photovoltaik, Betrieb & Pflege und Gebäudetechnik sind aus der Referenz abgeleitet; Formulierungen in `services.ts`, die FAQ-Antworten (`faq.ts`) und die Erklärtexte des Schaubilds (`flow.ts`) entsprechend schärfen oder streichen. Das Foto der Gebäudetechnik-Karte zeigt einen Heizkreisverteiler; passt ein anderes Gewerk besser, Foto tauschen.
7. **Schulungsangebot** bestätigen: Formate, Zielgruppen, ggf. Termine und Preise (`training.ts`).
8. **Berufsbezeichnung**: „Ingenieur“ ist in Deutschland geschützt. Die Texte vermeiden das Wort derzeit; erst nach Bestätigung der Qualifikation wieder aufnehmen (auch der Markenbestandteil „Engineering“ ist Arbeitsstand).
9. **Markenname und Logo**: „GLE · Green Life Engineering“ ist Arbeitsstand; die typografische Wortmarke lässt sich in `src/components/Wordmark.tsx` ersetzen.
10. **Eigene Fotos** realer Anlagen und der tatsächlichen Arbeit, sobald vorhanden: zuerst die beiden Montagefotos und das Hero-Motiv ersetzen, danach `images.json` und die Bildnachweise prüfen (CC-BY-SA-Fotos benötigen die Nennung, Unsplash- und Pexels-Fotos nicht).
11. **Unternehmensseite** ergänzen, sobald belastbar: Team, Gründung, Standort, Referenzen. Bisher bewusst ohne solche Angaben.

Bewusst weggelassen: Solarrechner (als spätere Erweiterung vorgemerkt, ohne Referral-Link der Referenzseite), Sprachumschaltung, Projektgalerie, Kundenstimmen, Kennzahlen, Partner-Logos, Analyse-Tools, Cookie-Banner (nichts erfordert eine Einwilligung), Speicher, Wallboxen und Herstellerprodukte (keine bestätigten Leistungen).
