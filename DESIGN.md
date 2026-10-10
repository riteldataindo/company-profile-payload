# SmartCounter Company Profile Design System

**Status:** Design contract for the local Next.js + Payload company-profile project

**Applies to:** `src/app/(frontend)`, shared public UI components, and public media managed through Payload

**Last validated:** 2026-08-13

**Languages:** English (`en`) and Indonesian (`id`)

This document defines how the existing SmartCounter company profile should be improved. It is not a request to replace Next.js, Payload, Tailwind, the theme system, or the current component library.

Read this together with `PRD-SmartCounter-Company-Profile-Revamp.md`. The PRD owns product truth, route scope, content evidence, and release acceptance. This file owns visual hierarchy, composition, interaction, responsive behavior, and design QA. If they conflict, the latest explicit user decision and the PRD win.

---

## 1. Creative North Star

### Physical Space, Made Inspectable

SmartCounter connects a physical place to an operational decision. The visual system should make that chain easy to inspect:

`physical context -> validated processing -> aggregate signal -> dashboard -> operational decision`

The site should feel like a calm operations room, not a generic AI landing page. It should combine:

- the clarity of a technical document;
- the confidence of a real product interface;
- the spatial language of entrances, paths, zones, floors, and occupancy;
- the restraint expected by operations, IT, privacy, and procurement buyers.

Signal Red identifies SmartCounter and important actions. It is a signal, not wallpaper. Real product evidence is the visual centerpiece. Decorative effects support hierarchy but never impersonate evidence.

### Desired first impression

Within five seconds, a visitor should understand:

1. SmartCounter is people-counting and visitor/spatial analytics.
2. It serves Retail and Mall operations.
3. It turns compatible camera/video inputs into aggregate operational signals.
4. A representative demo or site-fit discussion is the next step.

---

## 2. Design Principles

### 2.1 Evidence before decoration

Show an approved, redacted product view or an honest technical diagram before adding ornamental illustration. A customer logo, deployment map, metric, or dashboard number is evidence only when its source and permission are known.

### 2.2 Explain the decision, not merely the feature

Every visual should help answer one of these questions:

- How many people entered or passed by?
- Where did visitors move or dwell?
- What was occupied, congested, or underused?
- What can an operator review or change next?

### 2.3 Fixed foundations, free composition

Tokens, semantics, accessibility, interaction behavior, and evidence rules are fixed. Page-specific layout, density, hierarchy, diagrams, and visual storytelling remain flexible. Do not make every page a clone of the homepage or force every idea into a three-card grid.

### 2.4 Honest states are part of the design

Loading, empty, unavailable, illustrative, sample, conditional, error, and success states must be deliberately designed. Empty data must never become seeded proof.

### 2.5 EN/ID parity

English and Indonesian are equal public experiences. Layouts must tolerate Indonesian copy length without shrinking text, clipping controls, or silently falling back to English.

### 2.6 Restraint builds trust

Use one dominant idea per viewport. Prefer whitespace, alignment, clear labels, and real interfaces over glow, glass, animated particles, large claim stacks, or repeated badges.

---

## 3. Current-to-Target Direction

| Before | After | Why |
|---|---|---|
| Full-screen centered hero with a red glow and no product proof | Asymmetric hero with a clear Retail/Mall proposition and one approved product or system visual | Makes the product concrete above the fold and reduces empty space |
| Repeated centered headings followed by equal card grids | Varied editorial composition with a clear reading path and one dominant element per section | Creates hierarchy without sacrificing consistency |
| Twelve synthetic feature mockups presented as dashboard-like evidence | Three decision groups supported by approved screenshots; remaining mockups are removed or visibly marked `Illustrative sample` | Buyers need trustworthy product proof, not feature volume |
| Deployment dots and logos shown when CMS evidence is absent | Verified records render; otherwise the section is omitted or shows a neutral explanation | Prevents fabricated footprint and implied endorsement |
| Glass cards, glows, and hover lifts used across most sections | Flat document surfaces by default; dark evidence panels and elevation reserved for important moments | Makes visual emphasis meaningful |
| Infinite pointer, scan, orbit, and pulse animation | Short functional transitions and optional user-triggered explanatory motion | Motion should explain or confirm, not compete for attention |
| `transition-all` and hidden-until-observed content | Explicit property transitions; content visible before enhancement | Improves predictability, performance, and no-JS accessibility |
| Header packs nav, five locales, theme, Demo, and mobile menu controls | Simple desktop nav; EN/ID and theme controls move inside the mobile menu | Keeps the primary action usable at narrow widths |
| Package and Blog links compete with the core journey | Core public journey prioritizes Features, Use Cases, Deployment, Privacy, Contact, and Demo | Matches current evidence and commercial readiness |
| Serif fallback appears when the prior font fails | Instrument Sans is bundled through Next.js; system sans remains a deliberate fallback | Typography should not change the brand or hierarchy at runtime |

---

## 4. Foundation Contract

### 4.1 Brand colors

The current red and zinc foundations remain. Consolidate literal colors into semantic tokens instead of introducing a new palette.

| Token | Value | Use |
|---|---:|---|
| `--sc-signal` | `#DC2626` | Primary action, selected state, key path/zone signal |
| `--sc-signal-hover` | `#B91C1C` | Primary action hover |
| `--sc-signal-soft` | `#FEF2F2` light / translucent red dark | Quiet brand tint, selected row, annotation |
| `--sc-logo-red` | `#FF0000` | Logo artwork only; do not use as a general UI color |
| `--sc-success` | `#059669` | Confirmed success or healthy state |
| `--sc-warning` | `#D97706` | Warning or attention state |
| `--sc-danger` | `#C2410C` | Destructive action or blocking error |
| `--sc-info` | `#2563EB` | Neutral information state |

Rules:

- Use Signal Red for one primary action or one selected data signal in a local region, not every icon and heading.
- Never use red alone to communicate status. Pair it with text, icon, pattern, or shape.
- Do not place small white text on a color unless the pair passes WCAG AA.
- Avoid large red gradients behind body copy.
- Customer and product evidence keeps its authentic colors unless redaction or accessibility requires otherwise.

### 4.2 Surfaces

The light experience is the reference canvas; dark mode is a supported equivalent, not a separate art direction.

| Role | Light | Dark | Notes |
|---|---:|---:|---|
| Base | `#FFFFFF` | `#09090B` | Page canvas |
| Surface | `#F4F4F5` | `#18181B` | Alternate section or inset document area |
| Card | `#FAFAFA` | `#27272A` | Contained content; use sparingly |
| Elevated | `#E4E4E7` | `#3F3F46` | Menus, selected controls, compact overlays |
| Primary text | `#09090B` | `#FAFAFA` | Headings and essential values |
| Secondary text | `#52525B` | `#A1A1AA` | Body and explanations |
| Muted text | `#71717A` | `#A1A1AA` | Captions; must still pass contrast for its size |
| Subtle border | `#E4E4E7` | `#27272A` | Section/card separation |
| Default border | `#D4D4D8` | `#3F3F46` | Inputs and interactive boundaries |

Use near-black evidence panels for product screenshots, spatial diagrams, and technical sequences. Do not turn every section into a dark panel.

### 4.3 Data colors

Charts and spatial overlays use stable semantics within a view:

| Semantic role | Color | Typical use |
|---|---:|---|
| Traffic | `#3B82F6` | Visitor volume and trend |
| Flow | `#14B8A6` | Direction, path, entry/exit |
| Dwell | `#F59E0B` | Time and attention |
| Occupancy | `#8B5CF6` | Space or capacity |
| Positive comparison | `#059669` | Improvement or healthy threshold |
| Exception | `#DC2626` | Alert, anomaly, or selected critical point |

Charts must also expose labels, values, units, legend text, and a text alternative. Never rely on color alone. Do not imply that a color is a universal business threshold unless the threshold is defined.

### 4.4 Typography

Use the approved families:

- **Instrument Sans:** navigation, headings, body, buttons, forms, and captions. Its compact proportions support the editorial layout without introducing a separate display face.
- **Fira Code:** metric values, timestamps, IDs, units, compact technical labels, and code-like samples only.
- **System sans fallback:** `ui-sans-serif, system-ui, sans-serif`.

The font must be self-hosted, bundled, or loaded through a reliable Next.js strategy. A render-blocking stylesheet that can fall back to Times New Roman is not acceptable.

| Role | Size guidance | Weight | Line height | Notes |
|---|---|---:|---:|---|
| Display / H1 | `clamp(2.5rem, 6vw, 4.75rem)` | 700 | 1.02–1.08 | One clear statement, not a claim stack |
| H2 | `clamp(2rem, 4vw, 3.25rem)` | 700 | 1.08–1.15 | Section proposition |
| H3 | `1.25rem–1.5rem` | 600–700 | 1.2 | Card or subsection title |
| Lead | `1.125rem–1.25rem` | 400 | 1.55 | Hero and section introduction |
| Body | `1rem` | 400 | 1.6 | Default reading text |
| Small | `0.875rem` | 400–600 | 1.5 | Help, metadata, compact controls |
| Data label | `0.75rem–0.875rem` | 500–700 | 1.4 | Fira Code; always include meaning/unit |

Rules:

- Keep readable text lines around 55–75 characters.
- Do not use uppercase for sentences. Uppercase is limited to short eyebrows and data labels.
- Do not shrink copy to repair Indonesian wrapping; fix width or composition.
- Use tabular numerals for comparable metrics.
- Avoid highlighted words on every heading. Red emphasis must carry meaning.

### 4.5 Spacing and grid

- Use a 4 px micro-grid and an 8 px layout rhythm.
- Preferred steps: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128` px.
- Public shell maximum: `1280px`.
- Standard content maximum: `1200px`.
- Reading column maximum: `720px`.
- Form column maximum: `640px` unless a supporting panel is present.
- Grid: 12 columns desktop, 6 columns tablet, 1 column mobile.
- Standard section padding: 72 px mobile, 96–112 px desktop.
- Do not use `min-h-screen` only to manufacture drama. On a typical laptop, the hero should reveal the beginning of real proof or the next section.

### 4.6 Shape, border, and elevation

| Role | Radius | Treatment |
|---|---:|---|
| Compact control | 6 px | Menus, small tags, code labels |
| Button/input | 10 px | Default interactive radius |
| Card/panel | 16 px | Primary contained surface |
| Evidence stage | 20–24 px | Rare; for the dominant screenshot or system diagram |

- Use one-pixel borders to define most surfaces.
- Default cards are flat. Hover does not need a lift.
- Use a small shadow for menus and a restrained deep shadow for the single dominant evidence panel.
- Backdrop blur is allowed only for the sticky header, menus, and a legibility overlay on imagery.
- Avoid nested rounded rectangles where spacing or a divider is enough.

### 4.7 Focus

Every interactive element uses a visible two-pixel focus ring plus a two-pixel offset. The ring must work on light, dark, and image surfaces. Never remove outlines without an equivalent visible replacement.

---

## 5. Visual Language

### 5.1 Spatial motifs

Use the product's real vocabulary as a subtle visual system:

- entrance thresholds;
- zone outlines;
- path segments;
- count markers;
- floor or venue frames;
- measurement ticks;
- timestamps and scoped filters.

These motifs may appear as dividers, annotations, masks, or diagram structure. They should feel measured and purposeful. Do not add random network particles, a global map, a decorative 3D globe, or continuous radar/scan effects.

### 5.2 Photography

Preferred subjects:

- actual retail and mall context;
- camera/sensor placement without exposing sensitive configuration;
- installation or calibration work;
- an operator reviewing aggregate output;
- entrances, floors, and zones that make the analytic context legible.

Requirements:

- Real photography is required for customer, deployment, team, and local-support proof.
- Record source, permission, owner, date, approved route, and EN/ID alt/caption.
- Never use generated people, fake premises, or stock stores as customer/deployment proof.
- Avoid identifiable faces unless consent and the use case are explicit.

### 5.3 Product screenshots

Product UI is the primary visual evidence.

- Use approved, redacted screenshots with sample or real-data status clearly stated.
- Default aspect ratio is 16:10; use 3:2 when it preserves important spatial context.
- Keep essential filters, timeframe, unit, and metric definition visible.
- Redact personal, tenant, location, and account details without destroying the workflow.
- Provide a deliberate mobile crop or an enlarge action; do not shrink a desktop dashboard into illegibility.
- Do not put invented customer names, locations, or numbers in buyer-facing mockups.

Every evidence figure includes a caption such as:

> Product interface · Redacted representative data · Metric availability depends on deployment configuration

Use a shorter localized equivalent when space is limited.

### 5.4 Diagrams and illustrations

Use diagrams for architecture, validation, data boundaries, and Retail/Mall workflows. A diagram is explanatory, not proof.

- Label it `Conceptual flow` or equivalent when implementation details are not confirmed.
- Keep the diagram readable as static content.
- Put the key explanation in HTML, not only inside SVG text.
- Generated artwork may be used only as non-evidence decoration and must not depict a customer, dashboard, metric, product installation, or employee.

### 5.5 Icons

Continue using Lucide for functional UI.

- Default sizes: 18 px controls, 20 px list items, 24 px feature emphasis.
- Use consistent stroke weight.
- Decorative icons are `aria-hidden`.
- Icon-only controls require an accessible name.
- Do not place every icon in a glowing colored square.

---

## 6. Composition System

### 6.1 Page rhythm

A page should alternate between explanation, evidence, and action. Avoid long runs of similarly weighted cards.

Recommended rhythm:

1. proposition;
2. mechanism or workflow;
3. contextual choice;
4. product evidence;
5. limitation/trust information;
6. action.

Sections may be centered, split, full-bleed, editorial, or data-led. Do not center every heading. Align copy with the visual or decision path it explains.

### 6.2 Homepage: maximum seven major sections

1. **Hero:** one proposition, Retail/Mall context, one primary Demo CTA, one secondary contextual action, and an approved product/system visual.
2. **How it works:** camera/video context to validated aggregate output; show prerequisites and avoid unsupported implementation details.
3. **Retail / Mall gateway:** two explicit choices with different operational questions, not two generic industry cards.
4. **Decision groups:** Traffic, Flow & Zones, and Operations; three groups instead of a twelve-card wall.
5. **Evidence and trust:** approved product views plus validation, privacy, deployment, and limitation facts. Render logos/cases only when verified.
6. **Demo action:** what the visitor will see, what input is useful, and what happens next.
7. **Buyer FAQ:** four to six high-value objections followed by the footer.

Do not render Packages, Blog, a fallback deployment map, a fabricated logo strip, or a standalone generic pain-point grid on the MVP homepage.

### 6.3 Retail solution page

The Retail page should show:

- the operator and decisions being supported;
- entrance/traffic, dwell/zone, and staffing/merchandising workflows only where approved;
- a real store-context image and relevant product view;
- metric definitions, prerequisites, and limitations near the visual;
- a Retail-prefilled Demo CTA.

The layout may use a path or storefront threshold motif. It must not borrow Mall floor/tenant language.

### 6.4 Mall solution page

The Mall page should show:

- the mall stakeholders and operating questions;
- entrance, floor, zone, occupancy, or tenant-area semantics only where approved;
- a clear topology or zone diagram and relevant product view;
- multi-floor, tenant, and privacy boundaries where applicable;
- a Mall-prefilled site-fit Demo CTA.

The Mall page must not be Retail copy with nouns replaced.

### 6.5 Features page

- Start with a Retail/Mall context control.
- Group capabilities under Traffic, Flow & Zones, and Operations.
- Each capability exposes definition, unit, decision, prerequisite, limitation, availability status, and approved visual.
- Replace the twelve-item hover spotlight with a simpler persistent selection pattern.
- Keyboard, touch, and pointer users receive the same information.
- Feature-detail pages remain only when they contain unique approved content and evidence.

### 6.6 Deployment and Privacy pages

Treat these as technical editorial pages, not marketing card collections.

- Use a clear contents rail on long pages.
- Prefer diagrams, requirement lists, scoped disclosures, and readable tables.
- A map is optional and renders only verified records with an equivalent text list.
- Privacy uses exact confirmed language for processing, retention, access, deletion, and review boundaries.

### 6.7 Demo and Contact pages

The form is the dominant task.

- Use a concise introduction and a calm two-column layout only when the supporting column adds useful expectations or trust.
- Explain what the visitor will see, what inputs help, and what happens after submission.
- Remove unverified duration, response-time, free/no-commitment, and live-demo promises.
- Replace `[Dashboard Preview]` with approved media or omit the preview entirely.
- Confirmation and failure states appear in the same context without layout jumps.

### 6.8 FAQ

- Use native button disclosures with a visible expanded state.
- Add search/filter only when the published list is large enough to justify it; a short FAQ needs neither.
- Keep answers readable at a 720 px maximum width.
- Link to Deployment, Privacy, Features, Contact, or Demo when the full answer lives there.

### 6.9 Packages and Blog

Keep Packages out of the primary journey until names, entitlement, hardware, installation, support, and commercial terms are governed. Keep Blog out of primary navigation until missing media, placeholder video, evidence quality, and EN/ID editorial ownership are resolved.

---

## 7. Component Contracts

### 7.1 Header

- Sticky, 64–72 px tall, one-pixel divider after scroll.
- Desktop: logo, approved primary nav, one Demo CTA, locale, and theme.
- Mobile: logo, Demo, and menu trigger in the top row; navigation, EN/ID, and theme live inside the opened menu.
- The mobile trigger exposes `aria-expanded` and `aria-controls`; Escape closes; focus enters the menu and returns to the trigger.
- Do not use a mega-menu or Solutions dropdown for the current route set.

### 7.2 Actions

| Type | Visual | Use |
|---|---|---|
| Primary | Signal Red fill, white label | One main conversion action per region |
| Secondary | Neutral border/surface, primary text | Important alternate path |
| Tertiary | Text link with optional directional icon | Navigation and supporting detail |
| Destructive | Danger fill or outlined danger treatment | Confirmed destructive operation only |

All actions:

- minimum 44 × 44 CSS px target;
- default, hover, focus-visible, active, disabled, and loading states;
- active press scale around `0.97` for button-like controls;
- no hover-only information;
- no broad `transition-all`.

Reuse and normalize the existing button primitive rather than maintaining page-specific CTA class strings.

### 7.3 Cards

A card must group related information or support comparison. A rounded rectangle is not the default answer to spacing.

- Default: flat card, one-pixel border, 16 px radius, 24–32 px padding.
- Interactive: visible focus, clear selected state, optional subtle background change.
- Do not lift every card on hover.
- Do not nest cards more than one level deep.
- Equal-height cards are optional; never clip copy to maintain them.

### 7.4 Evidence figure

An evidence figure contains:

1. media or diagram;
2. title and context;
3. sample/provenance status;
4. metric/unit/timeframe when relevant;
5. limitation or prerequisite;
6. accessible alt or text equivalent.

Allowed labels:

- `Product interface`;
- `Redacted representative data`;
- `Illustrative sample`;
- `Conceptual flow`;
- `Verified customer evidence` only with recorded permission.

### 7.5 Capability status

Use text plus a small semantic marker:

- Available;
- Configured per deployment;
- Requires assessment;
- Package-dependent;
- Not currently published.

Do not use `Coming soon`, `AI-powered`, `real-time`, or a lock icon as a substitute for a precise status.

### 7.6 Forms

- Persistent visible label above every field.
- `id`/`htmlFor`, `autocomplete`, input mode, required state, help, and error relationships are programmatic.
- Inputs are at least 44 px high; text area grows naturally.
- Focus uses the shared focus contract.
- Validation is adjacent and does not rely on color.
- Submission exposes idle, submitting, success, recoverable error, and blocking error states.
- Privacy/consent copy is visible before submit.
- Do not put placeholder text in place of a label.

### 7.7 Disclosure and tabs

- Disclosure buttons expose `aria-expanded` and `aria-controls`.
- Panels stay in a predictable reading order.
- Tabs use arrow-key behavior when implemented as true tabs; otherwise use ordinary links or buttons.
- A selected state remains obvious without hover.

### 7.8 Footer

- Verified company identity and contact are mandatory.
- Keep route groups short and aligned with the published IA.
- Include Privacy and other approved legal/trust links.
- Use the correct social icon or a text link.
- On mobile, stack naturally; do not force a dense four-column impression.

---

## 8. Interaction and Motion

Motion should answer: what changed, where did it come from, or what should receive attention?

### 8.1 Timing

| Motion | Duration | Easing |
|---|---:|---|
| Press/focus feedback | 80–120 ms | ease-out |
| Hover/color/surface | 150–180 ms | ease-out |
| Menu/disclosure/tab | 180–250 ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| User-triggered spatial explanation | up to 600 ms | same ease-out curve |

### 8.2 Rules

- Animate `transform` and `opacity` for routine UI.
- Transition only the properties that change.
- Content is rendered in its complete visible state; enhancement may animate from that state after hydration.
- Respect `prefers-reduced-motion` with a complete static equivalent.
- Hover motion only runs on fine-pointer devices.
- Stop after the state change. Do not loop pointers, scan lines, orbits, glows, map dots, or attention pulses.
- Trajectory or zone motion is optional and user-triggered; its purpose is to explain a metric or transition.
- No scroll-jacking, parallax, autoplay video/audio, staggered section cascades, or simultaneous list reveals.
- Video needs controls, captions, transcript, poster, and a pause path.

The current `ScrollReveal` hidden-by-default behavior must not be the foundation for content visibility.

---

## 9. Responsive Behavior

Design and test at `320`, `375/390`, `768`, `1024`, `1280`, and `1440` px, plus 200% browser zoom and increased text spacing.

### Mobile

- One content column; no horizontal feature carousel for required information.
- Keep logo, Demo, and menu trigger readable in the header.
- Move EN/ID and theme controls into the menu.
- Use 24 px page gutters where practical, never less than 16 px.
- Stack Retail/Mall choices as two concise, distinct paths.
- Use deliberate screenshot crops or enlarge actions.
- Floating WhatsApp must not cover content, form controls, CTAs, or device safe areas.
- Avoid long rails of twelve or more visually identical cards.

### Tablet

- Six-column layout.
- Two-column evidence/copy composition may stack when either side becomes cramped.
- Keep metric labels and diagrams at readable sizes; do not merely scale desktop down.

### Desktop

- Twelve-column layout with intentional asymmetry.
- The hero visual may occupy 6–7 columns and copy 5–6 columns.
- Reading copy remains constrained even when the visual spans wide.
- Empty whitespace must support hierarchy, not separate related content by an entire viewport.

### Content resilience

- No fixed-height copy regions.
- Buttons tolerate localized labels.
- Tables become labeled stacked comparisons or an accessible overflow region; text is never reduced to fit.
- Images declare intrinsic dimensions to prevent layout shift.

---

## 10. Accessibility Baseline

Target WCAG 2.2 AA on every public EN/ID route.

- One H1 and logical heading order.
- Skip link, landmarks, correct page language, and descriptive page title.
- Native link/button semantics and full keyboard operation.
- Visible focus on every interactive element.
- Icon-only actions have names; decorative SVG/icon content is hidden from assistive technology.
- Form fields have associated labels, help, required/invalid state, and announced success/error.
- Menus, disclosures, tabs, and selectors expose their current state.
- Text and meaningful graphics meet contrast requirements.
- Charts and maps provide a text/table equivalent.
- Image alt describes function or information; decoration uses empty alt.
- Meaning survives without animation, hover, JavaScript enhancement, and color.
- Product videos include captions, transcript, and controls.

Automated checks are necessary but not sufficient. Include keyboard-only review, screen-reader spot checks, contrast checks, no-JS review, reduced-motion review, zoom, and text-spacing tests.

---

## 11. Content and Localization

### 11.1 Voice

Use calm, specific, operational language. Prefer:

- `Review entrance traffic by period`
- `Compare configured zones`
- `Metric availability is confirmed during site assessment`

Avoid:

- `Revolutionize your business`
- `Powerful AI insights`
- `Guaranteed accuracy`
- `100% compliant`
- unexplained acronyms and unscoped percentages.

### 11.2 Labels and numbers

- Every metric includes name, unit, timeframe, scope, and definition where ambiguity is possible.
- Use locale-aware number/date formatting.
- Do not translate product names, IDs, or established technical terms inconsistently.
- EN/ID captions, alt, errors, and empty states are content, not optional metadata.
- Do not silently merge missing Indonesian arrays or copy from English on public pages.

### 11.3 CTA language

The primary CTA should state the actual next step, such as `Request a representative demo` / `Minta demo representatif` or `Discuss site fit` / `Diskusikan kesiapan lokasi`. Do not promise a duration or response time until the operation can meet it.

---

## 12. Do / Do Not

### Do

- Lead with Retail/Mall context and a real operational question.
- Use approved product screenshots as the dominant visual evidence.
- Keep product limits and prerequisites near the related capability.
- Use Signal Red sparingly for actions and selected signals.
- Let layouts vary while preserving tokens and interaction contracts.
- Make every state work in light/dark and EN/ID.
- Reuse and simplify the existing spotlight, form, FAQ, and shell components.
- Fail closed when CMS proof is empty or unverified.

### Do not

- Create a second design system or add a UI dependency for this redesign.
- Use a generic glass-card grid as the default page structure.
- Present synthetic locations, dashboard values, maps, or logos as proof.
- Use AI-generated people, stores, dashboards, or deployments as evidence.
- Add a 3D globe, chatbot, decorative map, particle field, or autoplay hero video.
- Loop pointer, pulse, orbit, scan, or map-marker animation.
- Use `transition-all` for routine UI.
- Hide meaningful content until an IntersectionObserver runs.
- Use tiny text, excessive uppercase, or keyword-stuffed image alt.
- Restore Packages or Blog to primary navigation before their truth/content gates pass.
- Expand beyond EN/ID without a new explicit decision.

---

## 13. Implementation Order

Improve the existing system in this order; do not start with decorative polish.

### P0 — Foundations and truth

1. Bundle Instrument Sans reliably and keep content visible without JavaScript.
2. Consolidate semantic tokens and normalize button, input, focus, card, and evidence states.
3. Remove or clearly label synthetic proof; remove placeholder media and unverified claims.
4. Simplify the header/mobile menu and expose EN/ID only.
5. Build the seven-section homepage hierarchy with one honest visual source.
6. Make Demo, Contact, FAQ, and footer accessible and truthful.

### P1 — Product storytelling

1. Add approved dashboard views, deployment/context photography, and a technical/data-boundary diagram.
2. Build distinct Retail and Mall compositions.
3. Group Features by decision and add capability statuses, definitions, and limitations.
4. Add Deployment and Privacy editorial surfaces.
5. Complete light/dark and EN/ID parity across key routes.

### P2 — Measured polish

1. Add optional user-triggered spatial explanation.
2. Refine illustration, chart, and annotation language.
3. Add cases, editorial media, or advanced page composition only after evidence exists.

No extra design sidecar, component package, animation library, or CMS abstraction is required for P0.

---

## 14. Design QA Gate

A public UI change is ready only when all applicable checks pass.

### Visual and content

- [ ] The page has one clear dominant idea and one primary action.
- [ ] Category and Retail/Mall context are understandable without reading every card.
- [ ] No placeholder, fake proof, unsupported number, or ambiguous sample state is visible.
- [ ] Every product visual has source/status/caption and an accessible alternative.
- [ ] Signal Red remains an accent rather than the page background language.
- [ ] Light and dark modes preserve hierarchy and contrast.
- [ ] EN and ID are complete and visually resilient.

### Interaction

- [ ] All controls have default, focus-visible, active, disabled, and relevant loading/error/success states.
- [ ] No required information depends on hover.
- [ ] No routine interaction uses `transition-all`.
- [ ] Reduced motion gives a complete static experience.
- [ ] Content remains visible without JavaScript/IntersectionObserver.

### Responsive and accessible

- [ ] 320–1440 px and 200% zoom have no clipping, overlap, or horizontal page scroll.
- [ ] Touch targets are at least 44 × 44 CSS px.
- [ ] Header, locale/theme, forms, Feature selection, FAQ, and footer work by keyboard.
- [ ] Labels, descriptions, errors, menus, disclosures, and selected states are programmatic.
- [ ] Charts/maps have text equivalents and do not rely on color.

### Performance

- [ ] Hero media has responsive sources, intrinsic dimensions, and an appropriate mobile crop.
- [ ] Below-fold screenshots, map, and video are lazy-loaded.
- [ ] No autoplay media or unnecessary global map/media payload is introduced.
- [ ] Production checks target p75 LCP <= 2.5 s, INP <= 200 ms, and CLS <= 0.1.

---

## 15. Existing Source Mapping

Improve the current implementation instead of creating parallel primitives:

| Concern | Existing source | Direction |
|---|---|---|
| Global tokens and spotlight styling | `src/app/globals.css` | Consolidate literals into semantic tokens; reduce glow/glass/loops |
| Homepage order | `src/app/(frontend)/[locale]/page.tsx` | Replace the long equal-weight sequence with the seven-section journey |
| Hero | `src/components/sections/Hero.tsx` | Split proposition and approved proof; remove forced full viewport |
| Features | `src/components/sections/FeaturesGrid.tsx` and `FeatureMockup.tsx` | Keep one selection pattern; group decisions; replace or label synthetic UI |
| Heatmap | `src/components/sections/HeatmapBenefit.tsx` | Replace the named synthetic dashboard with approved evidence or a neutral labeled concept |
| Use cases | `src/components/sections/UseCasesShowcase.tsx` | Make Retail and Mall first-class; reduce six-format competition |
| Map/logos | `DeploymentMap.tsx` and `ClientLogos.tsx` | Render verified CMS evidence only; otherwise omit |
| Motion | `src/components/sections/ScrollReveal.tsx` and `globals.css` | Visible-first enhancement; remove decorative loops |
| Header controls | `Navbar.tsx`, `LocaleSwitcher.tsx`, `ThemeToggle.tsx` | Simplify desktop; accessible mobile menu; EN/ID only |
| Actions | `src/components/ui/button.tsx` and page-level links | Normalize one primitive and explicit state transitions |
| Forms | Demo page and `ContactClient.tsx` | Keep existing submission flow; fix field semantics and truthful states |
| FAQ | `FaqAccordion.tsx` and `FaqClient.tsx` | Accessible disclosure; search only when useful |
| Footer | `src/components/layout/Footer.tsx` | Verified identity, current IA, privacy/trust links, correct icons |

---

## 16. Definition of a Strong Result

An 8/10 result is not a site with more animation or more cards. It is a site where:

- the product and Retail/Mall fit are immediately clear;
- the visual hierarchy leads from physical context to aggregate signal to decision;
- approved product evidence is more prominent than claims;
- limitations and sample status are easy to inspect;
- Demo and Contact feel credible and work in EN/ID;
- mobile, keyboard, reduced motion, and dark mode feel intentional;
- the implementation still looks and behaves like one coherent SmartCounter system.

A 9/10 result adds repeatable, permissioned Retail and Mall evidence, stronger spatial storytelling, and measured conversion/performance improvements. It does not require a new framework, more locales, decorative 3D, or a larger component catalog.
