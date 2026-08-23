# SmartCounter Company Profile — Hard Truth UI/UX Review

**Date:** 2026-08-13  
**Status:** Saved findings. Sections A–H are the original critique. Section I records what shipped afterward.  
**Reviewed:** Live local site at `http://localhost:3000` (light and dark, desktop 1440/1920 and mobile 390), plus homepage/interior code and `DESIGN.md`.  
**Locales:** `en`, `id`  
**Mobbin:** MCP was unavailable. Benchmarks are live first-party sites, not a template gallery.

**Priority order used:** clarity → credibility → storytelling → visual quality → motion → novelty.

The site should feel like *a serious B2B analytics company with a highly polished modern product* — not a design agency showing every effect it knows.

---

## Executive verdict

This is already a better-than-average B2B site. It is not a premium SaaS product site.

The team followed the restraint chapter in `DESIGN.md` and skipped the evidence chapter. Liquid glass will not fix that. A product screenshot will.

A procurement buyer will think: *pretty, careful, maybe not a real product yet.*

**One-sentence direction:** Physical space, made inspectable — with the actual product as the object, and glass only where chrome floats on a photograph.

---

## A. Hard Truth Review

### What is already working (do not “refresh” this away)

- The seven-section homepage IA is correct: proposition → mechanism → Retail/Mall → three decision groups → limits → demo → FAQ.
- Voice is unusually honest. No “AI-powered insights,” no fake accuracy, no invented SLA.
- Type is strong: Instrument Sans, tight tracking, real display scale. This already looks more expensive than most Indonesian vendor sites.
- Gateway (Retail light / Mall dark) is the best designed object on the site.
- Demo form is a real conversion page: what you’ll cover, what not to send, no fake dashboard preview.
- Deployment and Privacy read like operations documents, not marketing cards.
- Motion is restrained. Almost no `transition-all`, no logo marquee, no particle field, no scroll-jacking.
- Proof is fail-closed: logos vanish if unverified, contact vanishes if identity isn’t confirmed, Packages/Blog are correctly 404.

### What is actually wrong

The product is invisible. The site sells *policy about measuring people*, using fashion-store photography with CAD triangles on top. Density shows a sensor and Atlas. Mixpanel shows a chart that makes a decision. This site shows a boutique entrance and then apologizes for it.

### Scores

| Axis | Score | Why |
|---|---:|---|
| **Visual Design** | **6.5** | Type, photography, and whitespace are above average. Overlay craft is amateur next to the photos. Two design systems (Home CSS vs interior Tailwind). |
| **UI Quality** | **6.0** | Targets, focus, and forms are competent. Three button recipes, two FAQ widgets, unstyled selects, unused `button.tsx`. |
| **UX** | **6.5** | Path is clear. Then `/use-cases` is a dead nav item, Features hides Demo under a catalog, Contact is an empty card, mobile hero buries the visual. |
| **Brand Consistency** | **6.0** | Signal Red + zinc is right. Then Use Cases uses icon-in-pink-square, FAQ uses pill cards, 404 still has a red glow and Sparkles. |
| **Professionalism** | **7.0** | Sounds like a serious vendor. Looks unfinished where identity and product UI should be. Footer: “Contact details are available after the relevant team is confirmed.” |
| **Modernity** | **5.5** | 2024 editorial sans, 2019 overlay language, 0% product-as-art-direction. Not gimmicky. Also not current. |
| **Content Presentation** | **7.0** | Structure is excellent. Several H2s are the writing team talking to itself (“Evidence should show its limits,” “Three decision groups keep the story focused”). |
| **Motion / Interaction** | **5.5** | Right amount of motion, wrong amount of explanation. Hero layer toggle is the only interesting instrument. Navbar glass snaps and leaks. |
| **Conversion Potential** | **5.0** | Demo form is good. No product proof, no named customers on screen, CTA named six different ways, mobile WhatsApp will sit on Submit. |
| **Overall** | **6.2** | Honest brochure. Not yet “a serious analytics company with a polished product.” |

---

## B. Biggest Design Problems

### Critical

1. **No product UI anywhere.** Hero, Evidence, Features, Retail, Mall all reuse conceptual stills. Captions are honest; the pictures still occupy the evidence slot. Buyers remember the picture.
2. **Hero does not pass the five-second test.** H1 is “Make visitor movement easier to inspect.” The metadata title already says the real thing: people counting for retail and mall. The page hides the category behind a workshop slogan.
3. **Mobile hero loses the visual.** On a 390px screen, H1 + paragraph + two full-width buttons eat the viewport. The instrument is a sliver at the bottom, controls clipped.
4. **Sticky nav is broken over dark sections.** `bg-bg-base/95` + `backdrop-blur-xl` lets “Explore Mall” bleed through the header. Looks like a bug, not glass.

### High

5. **Overlays look like campaign graphics, not measurement.** The hero cone is a flat triangle on a 3D doorway (and the photo already has a painted cone, so the control draws a second one). The retail path is a red worm. The mall “zones” and the heatmap are fashion-floor blobs with no legend, unit, or time window.
6. **`/use-cases` is in the primary nav and is a worse clone of Home Gateway.** Icon cards, pink squares, no Demo. ID nav even calls it “Solusi.”
7. **Copy hedges so hard it under-sells.** “Evidence should show its limits” is a design manifesto. Buyers need “Here is what an operator actually reviews.”
8. **Contact is structurally unfinished.** Giant empty left card: “Contact details are provided after the relevant team and channel are confirmed.”
9. **CTA thesaurus.** Request demo / site-fit demo / walkthrough / discuss a retail site / discuss a mall deployment / discuss the data boundary. One action, six names.
10. **Two visual systems.** Home is a designed document. Interiors are a different repo (type scale, padding, cards, FAQ).

### Medium

11. Features Mall is Retail with nouns swapped at the group-question level.
12. Decision Groups are a dark tuxedo around a text list. Near-black is reserved for evidence, not FAQs.
13. Features Demo CTA sits under the entire catalog.
14. WhatsApp green glow + float will cover Demo/Contact submit on 390px.
15. 404 is leftover marketing (glow, Sparkles).
16. No `aria-current` on nav. After Home you are visually nowhere.

### Nice-to-have

17. Locale control reads `EN · English`.
18. Theme toggle is a 3-state icon with no persistent label.
19. Footer social icons are all Globe.
20. Dead code: unused `ScrollReveal`, `FaqAccordion`, and the shadcn `Button` primitive. Flag only — do not delete in an unrelated change.

---

## C. Recommended Visual Direction

**Feel:** a calm operations room that happens to be beautifully typeset.

Not Apple Vision Pro. Not a Webflow “SaaS OS” kit. Not a design-agency reel.

**Hierarchy of surfaces**

1. **Paper** — white/zinc document. Default.
2. **Stage** — one near-black evidence well per page, holding a real product crop or a labeled diagram.
3. **Chrome** — sticky nav, HUD, menus. Thin frost, high opacity.
4. **Signal** — one red action per region.

If you remember one rule: **the dashboard is the art direction.** Photography supports it. Glass never replaces it.

---

## 1. Audit notes (page and component)

### Homepage

Reviewed live: hero, how-it-works, gateway, decision groups, evidence, demo, FAQ, footer. Code: `src/app/(frontend)/[locale]/page.tsx`, `src/components/sections/Hero.tsx`, `src/components/sections/home/*`, `src/lib/i18n/home-copy.ts`, `src/app/globals.css`.

**Strengths**

- Asymmetric hero, no `min-h-screen` drama.
- Honest captions and fail-closed logos (`ClientLogoRail` renders only with ≥2 verified records; currently **zero logos** on the live page).
- User-triggered spatial overlay (not a loop).
- Gateway split is the first moment that feels like SmartCounter.

**Failures**

- H1 `max-width: 12ch` at ~5rem forces a four-line poster. ID wraps harder.
- Dominant visual is generated-looking boutique photography, not product UI.
- Photo already contains a painted coverage cone; overlay `coverage` mode draws a second trapezoid. Entry/Targets do not remove the baked cone.
- HUD type is ~0.55–0.58rem (`CAM-01`, `T-01`) — unreadable theater.
- Success-green Check icons sit on navigation hints and limitation captions. Wrong semantic.
- How-it-works is a four-up equal grid (the pattern DESIGN.md told you to stop).
- Decision Groups use near-black for a text list. DESIGN.md reserves that surface for screenshots and diagrams.
- Evidence section contains no evidence. H2 is a manifesto.
- Demo section is the same zinc as Evidence (`--accent` is an alias of muted).
- CTA inventory on one scroll: Navbar Demo, Hero Demo, How FAQ, Gateway ×2, Decisions Features, Evidence FAQ/Privacy, Demo Demo/Contact, FAQ Contact, Footer, WhatsApp.

### Interior pages

| Page | Verdict |
|---|---|
| `/solutions/retail`, `/solutions/mall` | Strongest interiors. Distinct layouts. Mall is not a noun-swap. Missing product crop; overlays are campaign graphics. |
| `/features` | Best evaluator page. Catalog is the product story. Demo too late. Mall group questions stay retail-shaped. Remounts large WEBPs. `py-16` under fixed nav. |
| `/use-cases` | Weakest page still in the header. Home Gateway with the design stripped off. |
| `/deployment`, `/privacy` | Calm technical memos. Layout is waiting for retention/location sentences. Privacy primary CTA dumps IT into the sales form. Nav clearance lottery. |
| `/demo` | Best conversion page. Unify the button label. Selects have no chevron. |
| `/contact` | Generic SaaS contact template. Empty identity column. WhatsApp vs Submit. |
| `/faq` | Editorial header good; pill accordion is a different company from Home `<details>`. |
| `/packages`, `/blog` | Correct 404 + noindex. |
| `not-found` | Leftover marketing: red radial glow, Sparkles. Missing Deployment link. |

### Chrome

- Navbar is `<nav>` not `<header>`. Height ~76px (over 64–72 spec). Two button systems vs `.home-button`.
- Focus: Home uses blue `--sc-home-focus`; Navbar uses `ring-primary-500` on a red Demo (red-on-red).
- ID nav maps Use Cases → “Solusi” while gateway goes to `/solutions/*`.
- Locale switcher is JS-only; native `<select>` does nothing without JS.
- Theme JS default is dark; DESIGN.md says light is the reference canvas.
- Footer: fail-closed contact is correct; three Globe icons are not. Retail/Mall hardcoded English on `/id`.
- WhatsApp: green glow + icon-in-tinted-square. Collides with consent banner and form submit on 390px.

---

## 2. Benchmarks

Inspected 2026-08-13. Borrow craft and IA. Do not borrow category, claims, sensors, or AI theater.

Closest **visual** analog: [Density](https://density.io/).  
Closest **retail/mall IA**: [RetailNext Shopping Malls](https://retailnext.net/solutions/shopping-malls).  
Closest **analytics craft**: [Mixpanel](https://mixpanel.com/), [Amplitude Analytics](https://amplitude.com/amplitude-analytics).  
Closest **trust typography**: [Mercury](https://mercury.com/), [Stripe](https://stripe.com/).

| Reference | Pattern worth borrowing | Why it works | How SmartCounter should adapt |
|---|---|---|---|
| [Density](https://density.io/) | One physical object, then the software (Atlas). Specs are designed, not dumped. | IT can imagine Tuesday. | Pair one camera-context photo with one **redacted product crop** on the same stage. Keep Coverage / Entry / Targets, but make modes operational (*Today / This week / Compare*). Do **not** copy “plug & play” or gadget pricing. |
| [Mixpanel](https://mixpanel.com/) | Working chart + one decision sentence + caption. | Analytics buyers think in charts. | For Traffic / Flow / Occupancy: one annotated view + “Thursday 12:00–14:00, east entrance vs 4-week baseline.” Stamp **sample / redacted**. No AI-agent theater. |
| [Amplitude Analytics](https://amplitude.com/amplitude-analytics) | Setup → Explore → Analyze → Act as full-bleed UI stills. | Evaluators map their rollout onto the page. | How-it-works: `camera → validate → aggregate → operator view → decision`, with a readable UI crop at the last two steps. |
| [Stripe](https://stripe.com/) | The product *is* the hero. Claims have method notes and dates. | Competence demonstrated, not claimed. | Show EN and ID of the **same** dashboard crop. Footnote the metric definition. No fake counters. |
| [Linear](https://linear.app/) | Numbered product manual, 1:1 UI, almost no icon cards. | Craft is the brand. | Number the chain `01 Place → 06 Decision`. Figure IDs: `FIG · Entry line · Redacted`. Do not copy agent/PR sci-fi. |
| [Verkada Retail](https://www.verkada.com/solutions/retail/) | Ops jobs and IT objections on the same page. | Buying committee can all find themselves. | Put privacy/access/existing-camera answers next to the pretty picture. Do **not** copy face search. |
| [Occuspace Technology](https://www.occuspace.com/technology) | Define the metric, then show the dashboard. Comparison table. | Procurement can compare options. | Metric → UI pairing already in DESIGN.md. Coverage / prerequisite / output / limitation table. Ignore their “AI-powered” home. |
| [Mercury](https://mercury.com/) | Sensitive claims get footnotes. Security is a designed section. | Regulated-feeling without looking like a bank. | Treat retention/access like they treat insurance: plain sentences + link to Privacy. |
| [RetailNext Malls](https://retailnext.net/solutions/shopping-malls) | Mall page is not Retail with nouns swapped. | A mall GM hears leasing/occupancy, not “store traffic.” | Finish Features Mall questions. Steal IA only. |
| [Rhombus](https://www.rhombus.com/) | Hero is an incident object: camera ID, time, place. | Looks like the Tuesday console. | `Entrance A · 12:04 · sample` — not a hologram. Stay out of VMS narratives. |

**Rejected as primary references:** Amplitude homepage (campaign takeover), Tableau, Looker, Snowflake, Databricks, Heap, Eagle Eye, Sensormatic people-counting (stock + unverified conversion claims).

### Why those sites feel more polished than a Next + Tailwind kit

| Template habit | What the good sites actually do |
|---|---|
| Equal card grid as default | Unequal composition: one dominant figure, a caption, a next action. |
| Icon + H3 + 20 words | UI + decision sentence. |
| Unreadable browser-frame mockup | Crops at reading size. Filters and units stay legible. |
| Logo marquee = proof | Named story with scope. Logos are secondary. |
| Gradient + blur as personality | Hairline borders, real type scale, one accent. |
| Hover-lift on every card | Almost no decorative hover. |
| Unsplash + abstract 3D | Owned media: sensor + UI + install, or the product running. |
| “Trusted by 10,000 teams” | A number with a denominator and a date. |
| Motion as atmosphere | Motion as explanation. Short, interruptible. |

Polish is **restraint + specificity + owned evidence**. It is not a new component library.

---

## 3. Liquid Glass

**Do not introduce Apple Liquid Glass as a system.** Refractive, specular, chromatic glass is OS chrome over *the user’s* wallpaper. On a people-counting company profile it reads as a gadget skin. Ops and procurement read decoration impersonating evidence. `DESIGN.md` §2.6 and §4.6 already forbid this.

A **thin frost** is fine. A glass website is not.

| Surface | Use glass? | Spec |
|---|---|---|
| Sticky navbar | **Yes, after scroll, and only if it actually covers content** | Fill `bg-base / 92–96`. Blur **8–12px**, not `xl`. 1px hairline. No saturate. Must not leak “Explore Mall.” |
| Hero HUD / layer controls | **Yes — the one justified use already shipped** | `rgb(9 9 11 / 0.84)` + `blur(12px)` + `white/16` border. Keep. |
| Mobile menu | **No** | Opaque `bg-surface`. Already correct. |
| Forms | **Never** | People will not type into ice. |
| Feature / decision / logo / testimonial cards | **Never** | Frosted claims look invented. |
| Product screenshots | **Never on the screenshot** | The dashboard is the object. |
| CTA containers | **No** | Solid Signal Red. |
| Stats | **No** | Paper + tabular numerals. |
| Cookie / consent | **No** | It is a document. Drop `backdrop-blur-xl` + `shadow-2xl`. |
| WhatsApp | Optional 8px blur on the *panel* only | Kill the green glow. |

**Recipe if used:** blur 8–16px, opacity 80–92%, 1px hairline, optional 1px top highlight `white/20`, shadow `0 8px 24px rgb(0 0 0 / 0.2)` max. **No** `saturate(180%)`, no chromatic fringe, no animated material.

The current nav is the cautionary tale: 95% fill + `blur-xl` is a GPU tax that still fails to hide the section underneath.

---

## 4. Visual asset strategy

Every visual must do one of: explain, prove, move, rank, convert. Decoration is not a sixth reason.

| Section | Asset | Purpose | Composition | Style | Motion |
|---|---|---|---|---|---|
| Hero | **Redacted product UI** as the dominant object; keep the entrance photo as *context*, not the product | Explain + convert | Split: copy 5 / stage 7. UI crop 16:10, filters + timeframe readable | Real product, sample stamp in-frame | Layer toggle already exists — drive it from real UI states, not a second SVG cone |
| Hero (until UI exists) | Rebuild the coverage overlay as a **measured SVG**, delete the baked-in photo cone | Explain | Match vanishing point of the doorway | Technical, data colors (flow teal, traffic blue) | User-triggered dash 480ms |
| How it works | **Static SVG chain**, not four Lucide tiles | Explain | Horizontal 01–04 with one moving token (a count packet) | Diagram, labeled `Conceptual flow` | Optional path draw on first view, once |
| Gateway | Keep type. Add a **tiny distinctive still** per path (store threshold vs atrium topology) | Hierarchy | Do not turn these back into cards | Existing editorial photos, cropped | Existing hover hairline only |
| Decision groups | **One product crop per group**, light section, not a black slab | Prove | Persistent selection (already on Features) | Redacted UI + definition | Opacity 160ms on swap, no blur |
| Evidence | Real screenshot **or** drop the figure. Stop putting generated POV under the word “Evidence” | Prove | 16:10, caption with provenance | Product interface · Redacted | None |
| Logo rail | Verified logos only (already correct). Live page currently has **zero** | Prove | Static grid, no marquee | Authentic color | None |
| Demo | One still of the walkthrough: a filtered traffic view, not a laptop mock | Convert | Beside Bring/Review/Decide | Same crop family | None |
| Retail / Mall | Keep photography. Replace blobs with **legend + zone IDs** | Explain | Path/threshold motif vs floor topology — layout already flips | Measured overlays | Optional user-triggered path |
| Features | Keep tabs. Stop remounting six huge WEBPs | Explain | Enlarge action on mobile | Same | Opacity only |
| Deployment / Privacy | Keep the diagram-as-document. Optional architecture SVG | Trust | No photography required | Line diagram | None |
| Contact | Company identity: real office or support photo **only if permitted**. Otherwise kill the empty card | Trust | Form-dominant | Paper | None |

**Do not produce:** 3D globes, isometric cities, generated staff portraits, stock “diverse team pointing at a dashboard,” Lottie loaders, mesh-gradient wallpaper.

The current editorial set (`home-device-coverage-v3`, `retail-path-zones-v3`, `mall-flow-zones-v3`, device-POV series) is photographically good and analytically weak. Keep the plates. Redraw the graphics.

---

## 5. Video strategy

`DESIGN.md` bans autoplay hero video. That ban is correct. Video earns a place only where stills cannot show **time**.

| Where | Story | Camera | Duration | Loop | Autoplay | Desktop / mobile | Controls | Ratio | Transition |
|---|---|---|---|---|---|---|---|---|---|
| Hero, **user-triggered** on the existing plate | Coverage field appears, a person crosses the entry line, a count increments once | Locked off, same angle as `home-device-coverage-v3` | 6–8s | Loop while “Entry line” is selected | **No.** Click the mode | Desktop: in the stage. Mobile: tap-to-play, poster = current still | Mute, play/pause, no fullscreen needed | 3:2 | Hard cut to still if reduced-motion |
| Features → Traffic | 12 seconds of a **real** dashboard: filter change, series updates | UI capture, 1:1, no fake browser chrome | 10–12s | No | No | Desktop inline. Mobile: poster + play | Yes, captions | 16:10 | Fade 160ms from poster |
| Retail page | Shopper crosses threshold → zone dwell (anonymous, no faces) | Ceiling-ish, real store if permitted; else do not shoot | 8s | Optional silent | No | Same as hero stage | Mute default | 3:2 | Sits where the still is now |
| Mall page | Floor vs gate: people stay on the floor, gate count is a different number | High atrium, locked | 8–10s | No | No | Same | Mute default | 3:2 | Same |
| Demo page (optional) | 20s “what a walkthrough looks like”: talking over one redacted view | Screen + voice, or screen only | 20–30s | No | No | Below the form intro, never instead of the form | Yes, captions, transcript | 16:9 | Document, not cinematic |
| Background loops / drone malls / handshake B-roll | — | — | — | — | — | — | — | — | **Do not make these** |

No installation hero unless you have real, permitted footage. No stock “busy mall timelapse.” If you cannot shoot real product UI, **do not use video to fake it.** An SVG overlay on the still you already have is cheaper and more honest.

---

## 6. Gradient and background system

The site is not too dark. It is **too even**: white / zinc / white / black / zinc / white. Two `#111113` slabs in a row (Mall tile → Decision Groups) kill emphasis. `--accent` is an alias of muted.

| Layer | Treatment | Where |
|---|---|---|
| **Base** | Solid `#FFFFFF` / `#09090B` | Page canvas |
| **Section** | Solid `#F4F4F5` / `#18181B` for How-it-works, Evidence, Demo — **alternate**, don’t stack two zincs | One muted, then paper, then muted |
| **Card** | Flat `#FAFAFA`, 1px border, no shadow | Forms, FAQ (unify on this) |
| **Stage** | `#111113`, one per page | Hero instrument, one evidence well |
| **Floating** | Frost recipe above | Nav after scroll, HUD, menus |
| **Interactive** | Signal Red fill or 1px ink border | Buttons only |

**Allowed atmosphere, used once**

- Soft radial at the *back* of the hero stage (`black` → `#111113`), not behind type.
- 4% noise on the dark stage so it doesn’t look like a CSS rectangle.
- No mesh gradient. No page-wide red glow. No grid wallpaper unless it is a *floor plan* motif at 3% opacity inside a diagram.

Light remains the reference canvas. Dark is an equivalent, not a nightclub.

---

## 7. SVG and illustration

Prefer the simplest thing that explains.

| Idea | Medium | Why |
|---|---|---|
| Camera FOV / entry line / targets | **SVG on the existing photo** (already started) | Must match perspective. Rebuild; don’t stack a second cone |
| Camera → validate → aggregate → view | **Static SVG** + optional CSS dash on first view | How-it-works replacement |
| Mall topology (gate ≠ floor ≠ tenant) | **Static SVG** | Mall page. Not a heatmap blob |
| Zone / occupancy | **SVG with legend** (zone IDs, not lava-lamp fills) | Features Flow & Zones |
| Heatmap | Only if it has a **scale and time window**; otherwise don’t | Current `device-pov-retail-heatmap-v1` is a poster, not a chart |
| Architecture / data boundary | **Static SVG** on Privacy/Deployment | A box-and-arrow is enough |
| Lottie / Rive | **No**, unless a designer is maintaining one overlay file | Cost > value |
| WebGL | **No** | Unjustified |

---

## 8. Motion design system

Existing token: `--sc-home-ease: cubic-bezier(0.22, 1, 0.36, 1)`. Use it everywhere. Delete the third curve on icons. **No blur-as-motion.**

| Token | Duration | Ease | Distance | Use |
|---|---|---|---|---|
| Fast | 100ms | `--sc-home-ease` | `scale(0.97)` | Press |
| Standard | 160ms | same | 0px | Color, border, opacity |
| Slow | 220ms | same | 4px along origin | Menu, WhatsApp panel, FAQ |
| Hero | 480ms (cap 520) | same | stroke-dash / opacity | User-triggered spatial explanation |

**Do:** hero layer toggle, FAQ height, tab opacity, button press, nav hairline.

**Do not animate:** headlines, photographs, logos, metric numbers you don’t publish, cards (no lift), navbar hide-on-scroll, staggered section reveals, keyboard actions.

`ScrollReveal` is a no-op leftover. Leave it dead. Do not revive hidden-until-observed content.

---

## 9. Micro-interactions

Worth doing:

| Interaction | Spec | Why |
|---|---|---|
| Button `:active` | `scale(0.97)`, 100ms | Already ~0.96. Unify. |
| Nav current page | 2px Signal hairline, no animation | Orientation |
| Hero / Features layer tabs | Instant selected fill; geometry 480ms | Explanation |
| FAQ | Chevron 180ms; panel height, not a jump | State |
| Form submit | Swap icon to static “Sending…”, not a 0.01ms spin under reduced-motion | Feedback |
| Select | Draw a chevron. Current `appearance-none` selects look broken | Affordance |

**Reject:** magnetic CTA, cursor-reactive glass, animated gradient borders, card spotlight, number counters (no public numbers), logo marquee, hover-lift.

Hover **only** inside `@media (hover: hover) and (pointer: fine)`. Most Tailwind `hover:*` on this site is ungated.

---

## 10. Performance

| Effect | Cost | Verdict |
|---|---|---|
| Nav `backdrop-blur-xl` + 95% fill | High, low visual return | Demote to `sm` or drop |
| Consent `backdrop-blur-xl` + `shadow-2xl` | High, illegal by DESIGN.md | Remove |
| Hero 1537×1023 + evidence 1672×941 + six Feature WEBPs remounted | LCP / decode | One priority image. Swap `src`, don’t remount |
| Video | High | User-triggered, poster, muted, `preload="none"` |
| Lottie / Rive / WebGL | High | Don’t |
| SVG dash 480ms | Cheap | Yes |
| `filter: blur()` on tab/icon enter | Paint + fog | Delete |
| Reduced-motion | All durations zeroed | Keep the hammer; also skip `@starting-style` offsets |

---

## 11. Design system improvements

`DESIGN.md` already specifies most of this. The site half-implements it. Stop inventing a third token layer (`--sc-*` + Tailwind `primary-*` + unused shadcn oklch).

### Typography

| Role | Size | Weight | Notes |
|---|---|---|---|
| Display / H1 | `clamp(2.5rem, 6vw, 4.75rem)` | 700 | **Relax `12ch`.** 18–22ch. Stop forcing a 4-line poster |
| H2 | `clamp(2rem, 4vw, 3.25rem)` | 700 | One proposition, not a process memo |
| H3 | 1.25–1.5rem | 600 | How-it-works H3s are 1.08rem — too small |
| Body | 1rem / 1.6 | 400 | |
| Lead | 1.125–1.25rem | 400 | Hero lead is undersized vs H1 |
| Kicker / metrics | 0.75–0.8rem Fira | 500–700 | Load Fira **600/700** or stop faux-bolding kickers |
| HUD | ≥0.7rem | 600 | Current 0.55–0.58rem is unreadable theater |

Families stay Instrument Sans + Fira Code.

### Spacing

- 4px micro, 8px rhythm.
- Section 72 mobile / 96–112 desktop (current desktop is 88).
- Container 1200 content / 1280 shell. Pick one and stop mixing.
- Nav 64–72px. Add `--sc-nav-offset` used by every page. Interiors with `py-16` under a ~72px fixed bar clip eyebrows.

### Radius

- 10px controls.
- 16px cards.
- Evidence stage can stay sharp (more serious than 24px squircles).

### Borders

- 1px default.
- Glass: `white/12` or `black/10`.
- Interactive: ink or Signal, not both.

### Shadows

- None on cards.
- Small on menus.
- One deep shadow on the single evidence stage, if any.

### Colors

- `--sc-signal #DC2626` only for the one action or the one selected datum.
- Ban `primary-500 #EF4444` in marketing UI.
- Data palette already exists (traffic `#3B82F6`, flow `#14B8A6`, dwell `#F59E0B`, occupancy `#8B5CF6`) and overlays ignore it.
- Success green must not sit on disclaimers.
- Add missing `--sc-warning` / `--sc-danger` if forms keep using brand red for errors.

### Motion

Fast / Standard / Slow / Hero as in section 8.

### Implementation rules

- One action primitive (extend `.home-button` to interiors, or actually use `button.tsx` after killing oklch-black).
- One focus ring: 2px `--sc-home-focus`, offset 2px. Delete `ring-primary-500` on red buttons.
- One FAQ: native `<details>`.
- Hover gated.
- Hardcoded `#111113` / `#f97316` deleted from overlays.

---

## 12. Content vs UI

Do not polish over weak messaging.

| Section | The real problem |
|---|---|
| Hero | **Copy + proof.** H1 is abstract. Visual is not the product. |
| How it works | **Layout + copy.** Process is real; four equal tiles don’t show a chain. |
| Gateway | **Mostly working.** Sharpen the two *questions*. |
| Decision groups | **Copy + proof.** H2 is meta. Needs a crop per group, not a black list. |
| Evidence | **Proof.** Titled Evidence, then explains why the picture isn’t evidence. |
| Demo (home) | **Hierarchy.** Same zinc as Evidence; third red pill on the page. |
| FAQ home | Working. Those answers should have informed the hero. |
| Features | **Content on Mall** + Demo placement. Tables are the product; keep them. |
| Use Cases | **IA.** Page should not exist in this form. |
| Retail / Mall | **Asset.** Layout is good. Overlays and missing product crop. |
| Deployment / Privacy | **Content completeness.** Layout is waiting for retention/location sentences. Privacy CTA should not be the sales form. |
| Contact | **Content (identity) + layout.** Empty card is a trust hole. |
| Demo page | Working. Unify the button label. |
| Footer | **Content.** Unverified identity. Globe icons. |

---

## D. Homepage section-by-section

| Section | Current problem | Redesign | Asset | Motion | Expected improvement |
|---|---|---|---|---|---|
| **Nav** | Leaks over dark; Demo styling ≠ Home; no current state; `EN · English` | Solid 92% fill after 1px scroll; one button class; `aria-current`; `EN` / `ID` only | — | Hairline only | Looks finished |
| **Hero** | Slogan + fashion photo + double cone; visual below fold on mobile | H1 names people counting + Retail/Mall. Stage = photo *or* product crop. Shorten lead. Visual in the first mobile screen | Redacted UI + rebuilt SVG overlay | Existing layer toggle | Five-second test passes |
| **How it works** | Four equal red-index tiles | One chain diagram | Static SVG | Optional one-shot dash | Mechanism becomes visible |
| **Gateway** | Best section. Mall dark + next section dark | Keep split. Add a 72px still. Don’t follow with another black band | Two small crops | Existing hover rule | Choice stays the climax |
| **Decisions** | Dark manifesto, no pictures | Light editorial rows + selected crop | 3 product stills | 160ms opacity | Features teaser that proves software exists |
| **Evidence** | Policy essay + generated POV; 0 logos | Either a real screenshot or rename the section to Limits. Logo rail stays fail-closed | 1 product still | None | Trust goes up instead of sideways |
| **Demo** | Same surface as Evidence; third identical CTA | Change register (paper on muted, or a thin Signal rule). One primary | Optional 20s walkthrough poster | None | Conversion band is visible |
| **FAQ** | Fine | Keep native `<details>`. Don’t clone `/faq` pills | — | Chevron only | Consistency |
| **Footer** | Unfinished company | When identity is verified, show it. Until then, don’t ship a hollow contact column | Real social icons | None | Looks like a company |

---

## E. Asset production list

### Photography — keep / recrop

Existing editorial plates in `public/editorial/`. Recrop for mobile. Do not generate more boutique interiors until overlays are rebuilt.

### Photography — new, only if permitted

- One real installation or calibration (no faces, no customer signage).
- One operator reviewing aggregates.
- Skip if you don’t have permission. A missing photo is better than a generated employee.

### Video

1. 6–8s entry-line loop, user-triggered.
2. 10–12s dashboard filter change.
3. Optional 20s walkthrough on `/demo`.
4. No B-roll.

### SVG

- FOV / entry / targets overlay (rebuild).
- How-it-works chain.
- Mall topology.
- Zone legend.
- Privacy / data-boundary boxes.

### Illustration / 3D

None.

### Product UI (this is the whole game)

- 3 redacted crops: Traffic, Flow/Zones, Operations.
- EN + ID.
- Sample stamp in-frame.
- 16:10.
- Mobile crop or enlarge.

### Icons

Lucide only. No tinted squares. Fix footer socials.

### Background

Optional 4% noise on the dark stage. No mesh pack.

---

## F. Motion and interaction specification

Implement these only:

1. Nav becomes opaque enough to hide content (not more glass).
2. Unify press to `scale(0.97)` / 100ms.
3. Hero layer geometry 480ms dash, user-triggered.
4. Features image swap: opacity 160ms, no remount, no blur.
5. FAQ panel: height + chevron.
6. Form selects: chevron.
7. Nav current-page hairline.
8. Reduced-motion: static overlays, static send state.

If a ninth idea is “it would look cool,” it is out.

---

## G. What NOT to do

- **Gimmicky:** Apple Liquid Glass, refractive headers, cursor blobs, magnetic buttons.
- **Overdesigned:** glass cards, mesh backgrounds, 3D malls, particle fields.
- **Cheap:** icon-in-colored-square (`/use-cases`), green WhatsApp glow, Sparkles 404, `hover:-translate-y-1` on every card.
- **Template:** logo marquee, 3-up feature wall as the story, fake browser chrome around an unreadable PNG.
- **Apple clone:** saturate + specular + depth on every surface.
- **Too glass-heavy:** frosting claims, forms, logos, screenshots.
- **Too animation-heavy:** scroll-reveal cascades, count-up metrics, ambient hero video, looping scan lines.
- **Lying with taste:** prettier overlays that still aren’t product output.

---

## H. Prioritized execution plan

### P0 — hurting the site now

1. Fix nav opacity / leak over dark sections.
2. Fix interior `py-16` under the fixed header.
3. Rewrite hero H1 to name the product job. Relax 12ch.
4. Mobile: visual in the first screen; don’t clip HUD.
5. Kill or replace `/use-cases` in the header (use Home Gateway, or link straight to `/solutions/*`).
6. One CTA name. Put Demo in the Features header.
7. Contact: remove the empty identity card until `identityVerified` is true.
8. WhatsApp must not cover form submit.

### P1 — major visual upgrade

1. **One real redacted product screenshot family** (Traffic / Flow / Operations). This is the entire premium jump.
2. Rebuild overlays with perspective + data colors + in-frame sample stamp. Remove the baked cone.
3. How-it-works → one SVG chain.
4. Decision Groups off the black slab; attach a crop.
5. Unify Home vs interior type/spacing/buttons.
6. Features Mall questions that a mall operator would actually ask.
7. Light/dark nav that works on both canvases.

### P2 — premium polish

1. User-triggered 6–8s entry-line video on the existing plate.
2. 10–12s dashboard capture on Features.
3. Tab/FAQ/select micro-interactions as specified.
4. EN/ID of the same UI crop.
5. Footer identity + real social icons once verified.
6. Noise on the dark stage. Nothing else.

### P3 — optional / test

1. 20s demo walkthrough.
2. Real installation still, if permitted.
3. Comparison table (entrance vs zone vs floor).
4. Very thin frost on HUD only — already shipped.
5. Anything “Liquid Glass for the whole site.” Test it on a branch and kill it when it looks like a phone skin.

---

## Appendix — token and motion findings

### Token drift

Three palettes on one page:

1. Semantic `--sc-*` (the contract).
2. Tailwind `--color-primary-50…900` (brighter red; `primary-500` is `#EF4444`).
3. Unused shadcn oklch island (`button.tsx`, `tw-animate-css`).

`--sc-home-radius` is declared and unused. Dark evidence panels hardcode `#111113`, `#fafafa`, `#a1a1aa` instead of tokens. Overlay colors (`#f97316`, `#2dd4bf`) ignore the data palette.

### Motion inventory (keep / fix)

- Home buttons: explicit properties, 160/120ms. Keep.
- Spatial overlay: user-triggered, up to 520ms. Keep; rebuild geometry.
- `@starting-style` on popovers: keep, drop blur.
- `feature-detail-swap` blur + remount: fix.
- Navbar blur snap at 40px: fix opacity, reduce blur.
- No public `transition-all`. Good.
- No `scale(0)`, no `ease-in`, no logo marquee, no autoplay video. Good.

### Dead code (flag, do not sweep in an unrelated commit)

- `src/components/sections/ScrollReveal.tsx` — no-op, unused on Home.
- `src/components/sections/FaqAccordion.tsx` — unused.
- `src/components/ui/button.tsx` — unused on public routes.

---

## Sources

- Live local review, 2026-08-13: `/en`, `/id`, `/solutions/retail`, `/solutions/mall`, `/features`, `/use-cases`, `/deployment`, `/privacy`, `/contact`, `/demo`, `/faq`.
- `DESIGN.md`, `PRD-SmartCounter-Company-Profile-Revamp.md`.
- Homepage and interior implementation under `src/app/(frontend)`, `src/components`, `src/app/globals.css`, `src/lib/i18n/home-copy.ts`.
- Editorial assets in `public/editorial/`.
- First-party marketing pages listed in section 2.

---

## I. Implementation status (after the critique)

Recorded 2026-08-13. This is not a second critique. It is what is live versus still open after P0–P3 work.

### Verdict after implementation

The brochure is more honest and more finished. The product is still not on the page. That remains the largest gap from section A.

Rollback for P3 only: delete `src/lib/i18n/scope-compare.ts`, `src/components/trust/ScopeCompareTable.tsx`, `src/lib/i18n/demo-walkthrough.ts`, `src/components/demo/DemoWalkthrough.tsx`, then unwire the two page imports. Do not rewrite P0–P2 to undo P3.

### Live checks (this write)

| Route | HTTP | Observable |
|---|---:|---|
| `/en/demo` | 200 | Form primary. `#demo-walkthrough` still + `<details>` transcript. No `<video>`. No `autoplay` attribute. Copy says “no automatically playing product film.” |
| `/id/demo` | 200 | Same unit. Title: “Urutan site-fit yang terdokumentasi, singkat.” |
| `/en/deployment` | 200 | `.scope-compare__table` after the editorial memo. Title: “Entrance, zone, and floor are different questions.” 3 data rows (entrance / zone / floor). |
| `/id/deployment` | 200 | Same table. Title: “Entrance, zona, dan lantai adalah pertanyaan yang berbeda.” |
| `/en`, `/en/features`, `/en/solutions/retail`, `/en/contact`, `/en/faq` | 200 | CTA string “Request a site-fit demo” present. |

### H P0 — shipped in the prior implementation pass

Not re-scored this write. Code and prior screenshots said:

1. Sticky `site-header` is opaque (not 95% + `blur-xl` leak).
2. Interiors use `--sc-nav-offset` / `pt-28`–`pt-32`.
3. H1 names people counting / visitor analytics for retail and mall. `max-width` relaxed off `12ch`.
4. Mobile hero visual is first (`order: -1`); HUD not clipped in the prior 390 capture.
5. Primary nav is Features / Retail / Mall. `/use-cases` is not a header destination.
6. One CTA name: “Request a site-fit demo” / “Minta demo site-fit”, including Features header.
7. Contact is form-only while identity is unverified.
8. WhatsApp FAB is omitted on `/demo` and `/contact`.

### H P1 — shipped with honest substitutes

1. **Still no redacted product UI.** Decision groups and Evidence use the `SignalDiagram` family, not a fake dashboard. This is the remaining premium jump.
2. Overlays rebuilt on cleaned plates (`home-device-coverage-v4.webp`, `retail-path-zones-v4.webp`, `mall-flow-zones-v4.webp`) with measured SVG and data colors (traffic `#3B82F6`, flow `#14B8A6`, dwell `#F59E0B`, occupancy `#8B5CF6`).
3. How-it-works is `home-flow-chain`, not a four-up icon grid.
4. Decision Groups sit on light paper with diagrams, not a black manifesto slab.
5. Home / interior tokens share `--sc-nav-offset`, `--sc-home-focus`, `.home-button`.
6. Features Mall questions are gate / floor shaped, not retail nouns swapped.
7. Header is solid on light and dark canvases.

### H P2 — polish shipped; video still absent

1. No 6–8s entry-line film. Overlay remains user-triggered SVG (480ms when `data-animate='true'`).
2. No 10–12s dashboard capture. There is still no permitted product UI to film.
3. Press `scale(0.97)` / 100ms. Features swap is 160ms opacity (`feature-detail-swap`). FAQ chevron + height. Form selects have a chevron. Nav `aria-current` hairline. Reduced-motion zeroes overlay / send spin.
4. No EN/ID pair of the same dashboard crop — same reason as P1.1.
5. Footer socials are inline LinkedIn / Instagram / YouTube SVGs. Unverified contact column stays omitted.
6. HUD frost only. No mesh, no page-wide glow.

### H P3 — isolated units, verified live this write

| Line | Result | Observable |
|---|---|---|
| 1. 20–30s demo walkthrough | **Pass (honest substitute)** | `DemoWalkthrough` under the form intro. Still `home-device-coverage-v4.webp` + timed transcript 00:00–00:24. No invented film. Isolated: `src/lib/i18n/demo-walkthrough.ts`, `src/components/demo/DemoWalkthrough.tsx`. |
| 2. Real installation still | **Absent, correct** | No permitted in-repo installation photo. None fabricated. |
| 3. Entrance / zone / floor table | **Pass** | Native table on `/en/deployment` and `/id/deployment`. Columns: coverage, prerequisite, output, limitation. Isolated: `src/lib/i18n/scope-compare.ts`, `src/components/trust/ScopeCompareTable.tsx`. |
| 4. Thin frost on HUD only | **Already shipped / not expanded** | `.spatial-stage__controls` keeps `backdrop-filter: blur(12px)`. Compare table and walkthrough do not add blur. |
| 5. Site-wide Liquid Glass | **Not shipped** | Correct. Section G still forbids it. |

Tests added: `tests/p3-polish.test.ts`. Prior pass: 43 tests, `pnpm audit:claims` clean, `tsc` 0, lint 0.

### Still open (do not paper over)

- A real redacted product crop family (Traffic / Flow / Operations, EN + ID). This is still the whole premium jump.
- Verified client logos on the live page (fail-closed; currently none).
- Permitted installation photography.
- User-triggered product film only if a real UI or real site can be recorded.
- Dead code still flagged, not swept: `ScrollReveal.tsx`, `FaqAccordion.tsx`, unused `button.tsx`.

### What was deliberately not done

Section G still holds: no Apple Liquid Glass system, no glass forms/cards, no autoplay hero video, no fake counts, no logo marquee, no hover-lift card grid, no Sparkles 404, no invented dashboard.
