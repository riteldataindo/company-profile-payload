# SmartCounter Payload Company Profile — Deep Analysis & Revamp PRD

**Status:** Local revamp implemented and verified; release/deployment held  
**Audit date:** 13 August 2026 (Asia/Jakarta)  
**System assessed:** `/home/admin/smartcounter-compro`, Next.js + Payload CMS  
**Repository baseline:** `49f4d52e7aaedf7caf7f664f000e3590598735f4`; implementation remains uncommitted in the preserved working tree  
**Local verification:** optimized production build, route/security smoke, EN/ID browser interaction review, and local migration status  
**Second Memory validation:** PASS WITH MATERIAL REVISIONS; locale overridden by user to EN/ID, 13 August 2026  
**Vault consulted:** `/home/admin/obsidian-vault` (read-only)  
**Out of scope:** the legacy CMS currently deployed at `smartcounter.id`, its content, visual quality, routing, and score

This document assesses the **local Payload company-profile project as the current website candidate**. The old public CMS is not used as a comparator or diagnosis baseline. Deployment/migration can be handled in a separate release plan.

Evidence labels:

- **OBSERVED** — directly found in the local source, configured Payload content returned locally, optimized build, or local browser render.
- **INFERENCE** — conclusion supported by observed evidence but requiring owner/user validation.
- **UNKNOWN** — product, customer, legal, or performance truth not established by the repository.
- **RECOMMENDATION** — proposed direction; not a statement about current product capability.
- **VAULT DECISION** — a recorded product/architecture decision from Second Memory. It guides the target state but is not proof that the code exists in this checkout or that a product claim is true.

Verification summary after local implementation:

- `pnpm build`, `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check`: PASS.
- `pnpm test`: PASS, 20/20.
- `pnpm audit:claims`: PASS, 173 source/build files scanned; `pnpm audit --prod`: no known vulnerabilities.
- Local production smoke: PASS, 20 approved HTML + 20 RSC routes, including security headers, inactive locales, redirects, hidden routes, and deliberate 404s.
- Rendered crawl: 20 EN/ID canonical pages each have one H1, canonical, reciprocal `en`/`id`/`x-default`, and an OG image; 28 discovered internal links have no broken target.
- Browser review: 320, 375, 390, 768, 1024, 1280, and 1440 px have no horizontal overflow; mobile menu/focus return, locale context preservation, feature controls, FAQ disclosure, form validation, theme, reduced motion, and no-JS content were exercised.
- Local mobile lab sample, not a production baseline: LCP 196 ms, CLS 0, longest observed interaction 24 ms, 343 KB transferred across 22 resources.
- Local Payload migrations `20260731_014053...` and `20260813_044846...` both report `Ran: Yes`; the pre-migration database backup is `/tmp/smartcounter-compro-db-backup.hLhYvy/smartcounter_web-before-product-truth.dump`.
- Final render evidence: [desktop Home](/tmp/smartcounter-final-qa/home-desktop.png), [mobile Home](/tmp/smartcounter-final-qa/home-mobile.png), [Mall Features](/tmp/smartcounter-final-qa/features-mall-desktop.png), [Privacy tablet](/tmp/smartcounter-final-qa/privacy-tablet.png), [Mall Demo mobile](/tmp/smartcounter-final-qa/demo-mall-mobile.png), and [dark Home](/tmp/smartcounter-final-qa/home-dark-desktop.png).
- Forms were validation-tested without submission. Owned email delivery, verified legal/contact data, real product/deployment/customer proof, production CWV, release-host configuration, and deployment remain external gates.
- The requested Mall reference was not reachable: `ssh malls` failed before connection because the alias did not resolve. No remote Mall behavior is asserted as fact.

## 0. Second Memory Vault Validation

### 0.1 Verdict and method

**PASS WITH MATERIAL REVISIONS.** The current-checkout audit and its **5.0/10** score remain valid. Second Memory confirms the Retail/Mall dual-solution structure plus first-class Deployment and Privacy pages. Its latest historical note selected English-only, but the user explicitly overrode that choice on 13 August 2026: the PRD target remains **EN/ID**.

The vault query was read-only. Its contextual/BM25 index was available but not configured, so validation used the skill-approved fallback: `wiki/hot.md`, `wiki/index.md`, direct text search, and the relevant source pages. The vault has no claim/source ledgers under `wiki/meta/ledgers`, and the relevant session notes have empty `sources` arrays. Therefore, vault material is used as **decision and historical implementation evidence**, not as independent support for accuracy, customer, deployment, privacy, or business-outcome claims.

### 0.2 Source and authority order

| Priority | Evidence | What it controls |
|---:|---|---|
| 1 | User decision, 13 August 2026: keep EN/ID | Current product requirement; supersedes the vault's English-only choice |
| 2 | Current checkout `49f4d52` plus local production render | Current-state score, current defects, and what code/assets are actually available here |
| 3 | `[[SmartCounter Web Retail and Mall Dual-Solution Expansion 2026-07-31#Scope and product architecture]]` | Retail/Mall product structure, solution routes, demo qualification, capability truth, Deployment, and Privacy direction |
| 4 | `[[SmartCounter Web — System Blueprint#Current dual-solution contract]]` | Consolidated dual-solution architecture, except where the user overrides locale scope |
| 5 | `[[SmartCounter Web English-Only dan Deep Bug Hunt 2026-08-04#Kontrak English-only]]` | Historical hardening/recovery lead; its language-removal decision is not the target |
| 6 | `[[Company Profile Next.js — Architecture Decision#Decisions]]` and the April build notes | Historical foundation only; later explicit decisions supersede them where they conflict |

### 0.3 Reconciliation with the current checkout

| Topic | Current checkout observation | Latest vault decision | PRD ruling |
|---|---|---|---|
| Locale | `en`, `id`, `ko`, `ja`, `zh`; EN/ID indexable; language switcher present | Vault later recorded English-only | **USER OVERRIDE:** EN and ID remain active/indexable and must be complete; KO/JA/ZH remain inactive until separately approved |
| Retail/Mall IA | Use Cases routes only; no `/solutions/*` routes | `/[locale]/solutions/retail` and `/[locale]/solutions/mall`, with a homepage gateway and Features toggle | Use canonical `/{en,id}/solutions/*` routes; do not overload the generic Use Case detail routes |
| Navigation | Broad Features/Use Cases/Packages/FAQ/Blog/Contact navigation | Keep navbar simple; do not restore a Solutions menu; route buyers through Home gateway, Features, Use Cases, contextual CTAs, and footer | Retail/Mall must be one action from Home, but not mandatory top-level navbar labels |
| Commercial scope | Conflicting public package taxonomies | Packages intentionally hidden from public/Admin navigation while scope is unresolved; records preserved | Hide Packages; do not delete stored commercial data |
| Trust architecture | FAQ fragments; no current Deployment/Privacy route | First-class localized Deployment and Privacy/Data pages with cautious, deployment-specific copy | Restore these as first-class EN/ID routes; FAQ does not replace them |
| Demo | Generic qualification plus Retail self-service link | Retail/Mall structured qualification; Mall must not link to the Retail self-service dashboard | One form with solution context; separate destination behavior by solution |
| Capability truth | Current collections lack the recorded solution/availability/requirements fields | Feature status, technical requirements, scope, freshness, and capability notes were implemented in a later uncommitted working tree | Recover/reconcile that work before designing a new schema |
| Brand | Current category copy is usable | One SmartCounter brand under the unchanged `Intelligence Visitor Behavior` slogan | Preserve the slogan as brand architecture; do not turn it into an unsupported performance claim |
| About | No current About page; bad redirect exists | Original product-focused decision explicitly removed About | Keep About out of MVP; establish verified identity on Contact/footer |
| Media | This Git checkout contains only wordmark/favicon/`llms.txt` | A historical release recorded 287 media files and 29 active logo records, stored outside Git/release source | Inventory and recover eligible media before commissioning replacements; permission/provenance still required |

### 0.4 Recovery gate before implementation

The later dual-solution and English-only work was recorded at `/home/iiw/Documents/RDI/SmartApps/smartcounter-web`, but that historical working tree is not present on this machine and the notes explicitly say the changes were uncommitted. The vault proves intent and prior QA, not recoverable source availability. Recovery must be selective: reuse dual-solution, security, routing, and content-truth work where valid, but do not apply removal of Indonesian support.

Before implementation begins:

1. search approved backups, worktrees, patches, editor history, or another authorized workstation for the July 31/August 4 change set;
2. compare any recovered files against `49f4d52`, the dual-solution vault contract, and the current EN/ID user decision;
3. reuse verified work rather than rebuilding it;
4. if no source is recoverable, implement only the smallest contract described here and treat historical QA counts as non-transferable.

This recovery check is **M0**. It is planning/repository archaeology, not a production or deployment action.

## 1. Executive Verdict

**Local Payload candidate score: 5.0/10.**

The project has a real foundation: its category is clear, visual language is coherent, Home/Features/Use Cases/Packages/FAQ/Blog/Contact/Demo routes exist, localized routing and SEO helpers are present, contact/demo submissions have server validation and persistence, analytics loading is consent-aware, and the optimized build, lint, types, and tests pass. The target keeps EN/ID while narrowing the five-locale implementation to two complete, reviewed public languages.

The hard truth is that it currently looks more credible than it is. The most impressive visual moments—the feature dashboard, heatmap, deployment map, and product figures—are synthetic or fallback-driven. The repository has no real dashboard screenshot, deployment photo, case-study visual, customer-proof ledger, architecture diagram, or approved product video. Some mockups contain hard-coded numbers and named malls/stores, and the fallback map labels 20 hard-coded cities as active deployments. A buyer can reasonably read those elements as proof.

The configured Payload content also exposes release-grade inconsistencies:

- Home and Packages show `Starter`/`Business`, while the same Packages page compares `Basic`/`Add-On`/`Premium`.
- The homepage FAQ contains only two records whose answers render as `Content placeholder.`
- The Demo page promises a free 30-minute personalized walkthrough and real sample data while its visual is the literal `[Dashboard Preview]` placeholder.
- Static dictionary copy says all packages include hardware/installation, installation takes 1–2 days, and privacy is `100% compliant`, while safer fallback FAQ copy correctly says these depend on assessment and agreement.
- The current checkout silently deep-merges incomplete Indonesian content with English. Because EN/ID is the approved target, missing Indonesian marketing content must block publication/indexation rather than silently fall back to English.
- The intended Fira Sans token is missing at runtime, so the production render computes `Times New Roman`; the external font request is paid for but not applied.
- Content wrapped by `ScrollReveal` starts at opacity 0 and depends on JavaScript/IntersectionObserver; the Features route produced a blank first viewport in repeated headless production captures.

The project does not need a larger rebuild. It needs a smaller, truthful release:

1. govern all Payload, dictionary, fallback, metadata, and generated-asset claims through one evidence gate;
2. reduce the homepage to one Retail/Mall gateway and keep navigation simple around Features, Use Cases, Deployment, Privacy, Contact, and Demo;
3. replace or label synthetic evidence, remove placeholder content, and add one real redacted product view;
4. hide unresolved Packages, complete and govern EN/ID routing/content, verify contact identity, and split Demo behavior by Retail/Mall context;
5. finish accessibility, visibility-without-JS, typography, SEO, form, and conversion instrumentation basics.

**Recommendation:** evolve the existing Payload implementation; do not replace its stack and do not add a fleet of new marketing pages. The quickest path to an 8/10 site is evidence and editing, not more components.

**Vault constraint:** first attempt to recover the uncommitted July 31/August 4 implementation. Reuse the Retail/Mall and hardening work where valid, but explicitly exclude English-only removal changes because the user selected EN/ID.

## 2. SmartCounter Positioning Assessment

### 2.1 Safe current positioning

> SmartCounter is an Indonesia-focused people-counting and visitor-analytics product that turns compatible CCTV/video streams into aggregate traffic and spatial signals for physical retail and mall operations. Exact metrics, performance, processing/retention, and integrations are deployment- and package-specific and should be confirmed through a site-fit assessment or representative pilot.

This is supported as **published local product positioning**, not independent proof of real-world performance. Source anchors include [the English dictionary](/home/admin/smartcounter-compro/src/lib/i18n/dictionaries/en.json:11), [homepage metadata](</home/admin/smartcounter-compro/src/app/(frontend)/[locale]/page.tsx:31>), [the cautious FAQ fallback](</home/admin/smartcounter-compro/src/app/(frontend)/[locale]/faq/page.tsx:19>), and [llms.txt](/home/admin/smartcounter-compro/public/llms.txt:1).

**VAULT DECISION:** retain `Intelligence Visitor Behavior` as the shared brand slogan above Retail Intelligence and Mall Intelligence. It is a brand architecture phrase, not evidence of a particular model, accuracy level, or business outcome. See `[[SmartCounter Web Retail and Mall Dual-Solution Expansion 2026-07-31#Scope and product architecture]]`.

### 2.2 What the current project communicates well

- The first viewport says `People Counting & Visitor Analytics` and names compatible CCTV, heatmaps, aggregate demographic insights, and operational decisions.
- `Get Demo` is consistent in the header and hero.
- The local use-case data currently presents Retail Store and Shopping Mall, which is closer to the correct primary segmentation than the six-format static fallback.
- Feature and use-case detail routes already use a challenge → solution → related analytics structure.
- The FAQ fallback contains useful conditional language around camera placement, lighting, network, representative manual validation, retention, and service agreement.
- The Demo form asks relevant qualification fields rather than offering only a generic email link.

### 2.3 Audience and buyer jobs

| Segment | Economic buyer | Users/champions | Core job | Evaluation evidence needed |
|---|---|---|---|---|
| Retail operations | COO, Head of Operations, regional/portfolio lead | Store manager, merchandising/VM, marketing, BI | Understand traffic and movement signals across stores for staffing, layout, campaigns, and operational comparison | Real UI, validation method, camera prerequisites, POS/integration scope, retail case |
| Mall operations | Mall GM, operations/asset leader | Operations, leasing/tenant relations, marketing, BI | Understand entrance/floor/zone/tenant movement and occupancy signals | Mall-specific topology, metric definitions, privacy boundary, real floor/zone output, mall case |
| Technical evaluator | IT, infrastructure, security, privacy/legal, facilities | Deployment and support teams | Decide whether the camera/network/processing/data model is safe and operable | Compatibility matrix, data flow, retention/access, calibration, integration, support terms |
| Commercial evaluator | Procurement, finance, executive sponsor | Sales/solution owner | Understand scope, entitlement, cost drivers, risk, and expected next step | One versioned package matrix, proposal boundaries, proof, service terms |

Retail and Mall share a platform but should not share generic copy. Their users, spatial units, commercial questions, and proof requirements differ.

### 2.4 Primary problem and value

- **Problem:** physical-location teams often lack a consistent view of visitor traffic and movement for operational review.
- **Value:** convert compatible camera streams into defined aggregate metrics that support a specific Retail or Mall decision.
- **Website job:** show the measurement, definition, prerequisite, limitation, product output, and next step—not promise the business outcome.

### 2.5 Differentiator status

**UNKNOWN:** the local project does not prove a unique algorithm, accuracy advantage, customer scale, market leadership, or proprietary technical moat.

Potential defensible territory, once evidenced:

- Indonesia-focused deployment and support;
- reuse of compatible CCTV infrastructure;
- Retail/Mall operating knowledge;
- transparent validation and metric definitions;
- a clear privacy/data boundary.

Until supported by a current artifact and accountable owner, these are hypotheses rather than hero claims.

### 2.6 Main buyer objections

1. What does “accuracy” mean for my entrance, floor, or zone?
2. Which cameras, recorder/stream formats, mounting positions, lighting, and networks work?
3. What data is processed, transmitted, retained, accessed, and deleted?
4. Which features are core, configured, add-ons, package-specific, or unavailable?
5. How do Retail and Mall metrics differ?
6. Are POS/API/export/multi-location claims actually available for my package?
7. What do hardware, installation, calibration, training, support, and service terms include?
8. Where is the real product, deployment, and customer evidence?

## 3. Competitor Landscape

Seven first-party websites were benchmarked for communication principles: [RetailNext](https://retailnext.net/), [Ariadne](https://www.peoplecounting.ai/), [V-Count](https://v-count.com/), [Density](https://density.io/), [Xovis](https://www.xovis.com/solutions/retail), [FootfallCam](https://www.footfallcam.com/), and [Trakomatic](https://www.trakomatic.com/). Vendor claims remain vendor-reported.

| Website | Strongest principle | Local Payload gap | Do not copy |
|---|---|---|---|
| RetailNext | Role/use-case journey, operational outcomes, cases, consistent discovery CTA | Current Home is feature/format-led and has no inspectable case | Enterprise module breadth, global scale/outcome claims |
| Ariadne | Metric definitions, architecture/privacy clarity, concrete demo promise | Current copy conflicts on privacy/install; no data-flow visual | Proprietary sensor/AI language, GDPR/certification statements |
| V-Count | Physical journey from storefront to entry, zones, queue, product bundles | Current 12-feature spotlight is less memorable than one buyer journey | Sensor names, accuracy, demographic and uplift claims |
| Density | Strong product UI/hardware/installation visual craft | Local asset tree has no real product/deployment media | Workplace positioning and pricing assumptions |
| Xovis | Distinct spatial language—paths, zones, flows | Local map/glow language is decorative or unsupported as proof | Sensor-grade capability or campaign identity |
| FootfallCam | Deep deployment and Retail/Mall evaluation coverage | Local site lacks compatibility/deployment detail | Catalog-scale navigation and vendor footprint metrics |
| Trakomatic | Regional contact and SEA evidence | Local contact exists but identity/proof are default fields | Facial-recognition claims and uneven product vocabulary |

Cross-site lesson: the best product communication follows **place/problem → metric → decision → proof → concrete next step**. SmartCounter should not compete on number of cards.

Detailed first-party research is in [the competitor benchmark](/home/admin/smartcounter-compro/docs/research/smartcounter-competitor-benchmark.md).

## 4. Top 3 Website References

### 4.1 RetailNext — best buyer journey and proof architecture

| Dimension | RetailNext principle | Current local Payload state | Adaptation |
|---|---|---|---|
| Hero | Category plus an operational question and discovery action | Category is clear, but audience role and product proof are missing | Add Retail/Mall decision context and one real UI crop |
| IA | Platform, sector, use case, resources/proof, company, support | Features, Use Cases, Packages, FAQ, Blog, Contact all carry similar weight | Keep a simple header; make Home Retail/Mall gateway, Features, Deployment, Privacy, Contact, and Demo the decision path |
| Product | Measure → decide → validate → scale | 12 capabilities are presented before validation or package boundary | Group by Traffic, Flow/Zones, Operations; place validation beside output |
| Mall story | Leasing, tenants, occupancy, campaigns, zone value | Mall exists as a selector/detail, but hero still says Retail | Give Mall an equal, distinct landing path |
| Proof | Named case structure with challenge, deployment, result | No complete local case asset or permission record | Put one methodologically complete case inside the relevant solution page |
| CTA | One consistent discovery call | Demo CTA is consistent but promises/preview are unverified | Keep one CTA and explain inputs, walkthrough, and fit decision |
| Footer | Product, solutions, resources, company, support | Footer has product/resources/contact but no privacy/company/proof | Add only verified company/privacy/support links |

**Learn:** organize around decisions and proof.  
**Do not copy:** Pulse AI, module breadth, customer scale, or vendor outcomes.  
**Worth adapting:** challenge → deployment → result case format and a stable discovery CTA.

### 4.2 Ariadne — best metric and privacy explanation

| Dimension | Ariadne principle | Current local Payload state | Adaptation |
|---|---|---|---|
| Headline | Understanding and privacy appear together | Hero mentions aggregate demographics but not data boundary | Add a short, approved data-boundary statement after mechanism |
| Product explanation | Defines footfall, occupancy, dwell, and flow before visuals | Local copy often names a metric and outcome without unit/denominator | Add definition, unit, prerequisite, decision, and limitation to each group |
| Architecture | Calibration, validation, privacy, and deployment are inspectable | Cautious FAQ contains fragments, but no coherent diagram/page | Restore the already-decided Deployment and Privacy pages; keep FAQ as concise objection handling |
| Visuals | Product/sensor/metric media support the explanation | Local visuals are synthetic SVGs and no real photos exist | Use one redacted dashboard, one deployment photo, one approved data-flow diagram |
| Demo | Time, inputs, outputs, and fit discussion are explicit | Local Demo says 30 minutes/real sample but shows a placeholder | Verify the promise; explain exactly what the buyer will see and decide |

**Learn:** define the metric and data boundary before asking for trust.  
**Do not copy:** Hybrid Fusion, ToF, no-PII, GDPR, or EU AI Act language.  
**Worth adapting:** a demo promise framed around venue context and fit/no-fit outcome.

### 4.3 V-Count — best physical journey framing

| Dimension | V-Count principle | Current local Payload state | Adaptation |
|---|---|---|---|
| Hero | Category, product scope, demo/how-it-works | Category and CTA are strong; visual is empty | Add a real product/deployment pair instead of more headline copy |
| Narrative | Storefront → entry → movement/zones → queue | Features are an interactive list/spotlight | Tell one verified journey; keep the complete catalog on Features |
| Product/hardware | Placement and products connect to stages | Compatible CCTV is stated but prerequisites are not visualized | Use neutral layers: entrance, zone, portfolio; avoid hardware names without product truth |
| Proof | Clients, downloadable cases, videos | Local client component has no local proof assets | Add permissioned evidence only; omit the logo wall otherwise |
| CTA | Demo, quote, product-live routes | Header/Home/Demo are consistent, but external preview is not verified | One primary site-fit demo plus contact fallback |

**Learn:** explain the product through the visitor journey.  
**Do not copy:** sensor names, accuracy, demographics, customer counts, or uplift numbers.  
**Worth adapting:** `approach → enter → move → dwell → act`, limited to actually enabled metrics.

## 5. SmartCounter Hard Truth Score

These scores describe the local optimized Payload build and current configured content. Field performance and real product/customer truth remain UNKNOWN.

| Area | Score | Hard truth |
|---|---:|---|
| First impression | 6/10 | Category and CTA are immediately clear; hero is text-only and visually under-proves the product |
| Visual quality | 5/10 | Red/zinc system and dark product panels are coherent; runtime serif font, generic glows, and synthetic dashboards cap quality |
| UI consistency | 4/10 | Shared components are consistent, but package taxonomy, theme presentation, and content completeness conflict |
| UX | 5/10 | Navigation and conversion paths are understandable; long page, hidden reveal content, placeholders, and route hierarchy add friction |
| Brand perception | 5/10 | Wordmark and signal-red language are recognizable, but there is no authentic visual world or company evidence |
| Product clarity | 6/10 | Compatible CCTV → analytics is clear; software/hardware/service, metric definition, and deployment boundary are incomplete |
| Content | 4/10 | Good cautious FAQ exists in source, but configured placeholders and contradictory static claims weaken the whole system |
| Visual storytelling | 4/10 | Feature spotlight is polished, yet the story depends on fabricated-looking UI rather than real physical-to-product evidence |
| Trust/credibility | 3/10 | Fallback active-deployment map, named mock locations, placeholder data, unverified contact, and no case method are high-risk |
| Conversion | 6/10 | Demo/contact forms and server plumbing exist; promises, preview, consent capture, and events are incomplete |
| Information architecture | 5/10 | Routes are broad and usable, but Retail/Mall are not top-level, while Packages/Blog are over-promoted relative to readiness |
| Mobile experience | 5/10 | Responsive stacking works; page is ~8,000 px tall, header is crowded, and evidence widgets become dense |
| Accessibility | 4/10 | Semantic foundations exist, but forms, FAQ state, mobile menu state/focus, map alternative, and hidden-by-default reveals fail the bar |
| SEO fundamentals | 6/10 | Canonical/hreflang/schema/sitemap/robots helpers exist; duplicate home title, mixed locale fallback, FAQ schema, and host/default risks remain |
| Performance readiness | 5/10 | Production build succeeds and UI is mostly CSS/SVG; external fonts, global Leaflet CSS, dynamic map, animations, and no field CWV require work |

**Overall: 5.0/10.** The project has a legitimate implementation base. The score is held down by evidence integrity and content governance rather than absence of engineering.

## 6. 5-Second Test

| Question | Likely answer from local render | Score |
|---|---|---:|
| What is it? | People counting and visitor analytics | 8/10 |
| Who is it for? | Retail first; Mall is discoverable later | 6/10 |
| How does it work? | Compatible CCTV becomes analytics; processing/deployment detail is unclear | 5/10 |
| What decision improves? | General operational decisions; exact owner/job is not specific | 5/10 |
| Is the product real? | The dark “dashboard” looks real, but no provenance identifies it as sample/illustrative | 3/10 |
| Is the company trustworthy? | Contact and forms exist, but proof, identity, privacy, cases, and claim method are thin | 3/10 |
| What should I do next? | Get Demo | 8/10 |

**Category clarity: 6.5/10. Trust after five seconds: 3/10.**

The first confusion is no longer “what category is this?” It is **“Are these dashboard/map numbers real, which Retail/Mall workflow is mine, and what exactly will the demo prove?”**

Recommended hero direction:

> Visitor traffic and movement analytics for retail stores and malls.

> Turn compatible camera streams into aggregate signals for defined operating decisions. Metrics and performance are confirmed for each deployment.

Primary CTA: **Request a site-fit demo**. Secondary links: **For Retail** and **For Malls**.

## 7. Visual / UI/UX Audit

### 7.1 Strengths

- The signal-red wordmark/action color creates immediate recognition.
- Light surfaces plus dark evidence panels can become a distinctive “physical space → analytics” system.
- The hero is calm and readable instead of visually overloaded.
- The Feature and Use Case spotlights show strong composition skill and are more memorable than a generic card grid.
- The current production Home is responsive from 1440 px to 390 px.
- Demo and Contact use straightforward two-column/card structures and clear red submit actions.
- Theme, locale, forms, disclosures, and mobile menu already exist as reusable components.

### 7.2 Critical visual/UX findings

1. **The intended typeface is not applied.** Production computation returns `Times New Roman`; `--font-sans` is empty even though Fira Sans is loaded in [the frontend layout](</home/admin/smartcounter-compro/src/app/(frontend)/layout.tsx:40>) and referenced in [globals.css](/home/admin/smartcounter-compro/src/app/globals.css:7). This makes the render look editorial/unfinished rather than like the intended product brand.
2. **Hero underuses its first screen.** A full viewport contains only centered copy/CTAs and a glow. The category is clear but there is no real UI, camera context, Retail/Mall choice, or trust marker.
3. **Synthetic product visuals are visually persuasive but semantically unsafe.** [FeatureMockup.tsx](/home/admin/smartcounter-compro/src/components/sections/FeatureMockup.tsx:26) and [HeatmapBenefit.tsx](/home/admin/smartcounter-compro/src/components/sections/HeatmapBenefit.tsx:6) show hard-coded values and named locations without an `Illustrative sample` label.
4. **Fallback map looks like proof.** [DeploymentMap.tsx](/home/admin/smartcounter-compro/src/components/sections/DeploymentMap.tsx:14) supplies 20 cities and labels them active when Payload locations are empty.
5. **Home is longer than its information value.** About 7,100 px desktop and 8,000 px mobile are spent on pain cards, map, features, heatmap, format selector, packages, FAQ, and CTA. Several sections repeat “analytics supports better decisions.”
6. **Mobile header is crowded.** Logo, locale, theme, primary CTA, and hamburger share 390 px; the CTA wraps and the menu edge becomes tight.
7. **Feature discovery depends on hover language.** “Hover or select” is desktop-centric; the interaction needs a clear selected state and tap/keyboard model.
8. **Features first viewport can disappear.** `ScrollReveal` renders opacity 0 before IntersectionObserver runs. Repeated local production headless captures showed a blank Features first viewport; without JavaScript/observer support, content remains hidden.
9. **Theme toggle adds UI but not buyer value.** The light and dark modes are not equally curated. One deliberate branded system would be more coherent and reduce header load.
10. **Package and FAQ surfaces look complete while content is not.** Visual polish masks taxonomy and placeholder defects.

### 7.3 Emil-style before / after / why

| Before | After | Why |
|---|---|---|
| Full-screen text-only hero | Left-aligned or balanced hero with real redacted UI, one deployment crop, Retail/Mall routes, and one CTA | The first screen should prove mechanism and audience, not merely occupy height |
| `People Counting for Retail` while Mall is a core segment | Audience-neutral headline plus explicit Retail/Mall choice | Mall should not discover that it is included only after scrolling |
| Hard-coded Fashion Store Bandung/Pondok Indah Mall dashboards | Real redacted screenshot, or explicit `Illustrative sample` label with neutral fictional data | Prevents a sample visual from impersonating customer/product evidence |
| “Active deployment — 20 cities” fallback map | Verified Payload records with provenance, or omit/label an empty state | Proof must fail closed, not manufacture confidence |
| Twelve feature spotlight items | Three decision groups with one representative UI each | Buyers remember a workflow; they do not need all modules on Home |
| Separate Pain Points + Heatmap + Use Cases + Packages repetition | Seven-section homepage centered on mechanism, segment, proof, objections, conversion | Shortens scanning and reduces duplicate claims |
| Starter/Business cards plus Basic/Add-On/Premium table | One approved package model, or remove Packages from public nav | A polished contradiction is still a contradiction |
| Placeholder FAQ styled as finished content | Publish four to six buyer-grade answers or hide FAQ section | Empty completeness is worse than honest omission |
| 600 ms entrance reveals from opacity 0 | Content visible by default; optional 150–250 ms transform/opacity enhancement | Meaning survives no-JS/reduced-motion and feels faster |
| Theme toggle in primary header | One curated brand theme; optional system theme only after core nav | Removes a non-conversion control and mobile crowding |
| Generic WhatsApp float on every route | Keep only after number/owner/response are verified and collision-free | Persistent contact should be reliable, not decorative |

### 7.4 Interaction requirements

- One primary CTA label site-wide: `Request a site-fit demo`.
- Retail/Mall choice is visible without opening navigation.
- Feature groups use accessible tabs/disclosures only when they shorten the page; all content remains available without hover.
- Do not use a carousel for proof, features, or cases.
- Content is visible in server HTML and without JavaScript; motion enhances an already complete state.
- Menus, accordions, tabs, theme/locale controls, and forms expose correct name, role, state, focus, and error behavior.
- Floating WhatsApp cannot cover mobile content, CTA, or browser safe areas.

## 8. Content Audit

### 8.1 Current problem → why it matters → direction

| Current local problem | Why it matters | Recommended direction |
|---|---|---|
| Hero is clear but retail-first | Mall buyers self-select late and product scope appears narrower than intended | Put Retail/Mall choice immediately after/inside hero |
| Static copy lists 12+ AI capabilities and outcome language | Public copy reads as a universal product promise | Add capability status, prerequisite, output, limitation, and package scope |
| Current Payload FAQ answers are `Content placeholder.` | A finished-looking FAQ actively reduces credibility | Block placeholder records from publication; seed only approved answers |
| Package cards and comparison use two taxonomies | Buyer cannot infer entitlement or price/scope | One versioned commercial source or hide Packages |
| `All include hardware and installation` conflicts with proposal-specific FAQ | Creates commercial/legal ambiguity | Default to `scope confirmed in proposal` until a package contract exists |
| Static FAQ says `1–2 business days` and `100% compliant` | Contradicts cautious assessment-dependent copy and lacks proof | Reuse the safer FAQ wording; remove absolutes |
| Heatmap/feature mockups contain named locations and exact values | Can be interpreted as customer evidence | Neutral sample names + clear label, then replace with approved screenshots |
| Map says `Active deployment` for hard-coded fallback cities | Turns a resilience fallback into a footprint claim | Empty/unknown state unless verified Payload records exist |
| `deployed across Indonesia` and logo components have no provenance | Trust claim has no date, permission, site/module scope | Add proof records or omit the statement/section |
| Demo says free, no commitment, 30 minutes, 24-hour response, real sample | Operational promises and data provenance are unverified | Publish only measured/owned expectations; state what will be shown and decided |
| Contact/footer values are hard-coded defaults and phone looks placeholder-like | Wrong/unowned contact details can lose leads | Require verified SiteSettings before public release |
| Current Indonesian dictionary is incomplete and deep-merges English | Current ID pages can silently become mixed language | Complete and human-review EN/ID; missing Indonesian marketing content blocks publication/indexation instead of silently merging English |
| Claim sanitizer covers Payload records, not dictionaries/fallbacks/assets | Unsafe static strings bypass governance | One rendered-output claim gate for every content source |
| Blog has one generic sales-oriented post and placeholder media | Looks seeded rather than editorially credible | Hide Blog until one real, reviewed, sourced article and asset exist |
| No localized About/company route | Company-profile trust depends almost entirely on footer/contact defaults | Add a verified company block to Contact; split About only when enough real content exists |
| Home title renders `... | SmartCounter | SmartCounter` | Signals metadata composition bug and weakens search preview | Ensure page title and template add the brand once |

### 8.2 Claim–evidence matrix

`VERIFIED` below means the local implementation/copy exists; it does not independently validate product performance.

| Claim/category | Local evidence state | Publishing rule |
|---|---|---|
| SmartCounter category and PT Ritel Data Indonesia identity | Published in dictionary/JSON-LD/footer; legal/contact truth UNKNOWN | Publish after owner verifies exact legal/product/contact record |
| Traffic, in/out, dwell, heatmap, occupancy, queue, routes, demographics | Source-published; real deployment/product evidence UNKNOWN | Show only approved capability status and deployment prerequisites |
| Compatible CCTV | Conditional published position | Say `compatible` and require assessment/matrix; never universal compatibility |
| Real-time/no-delay | Contradicted by cautious FAQ dependency on analytic/network/architecture | Remove absolute; state update interval after assessment |
| Aggregate/no identity/privacy | Plausible design statement but processing/retention/access evidence incomplete | Publish exact approved data boundary, never `100% compliant` |
| Accuracy | No current measured method/data in repository | Do not publish a percentage; explain representative validation/pilot |
| Install in 1–2 days / immediate readiness | Contradicted by assessment-dependent fallback | Remove fixed duration until scoped and measured |
| All packages include hardware/install | Contradicted by proposal-specific scope | Remove or tie to a versioned commercial record |
| API, unlimited zones, reports, journey, dedicated manager | Present in fallback package table; entitlement evidence UNKNOWN | Hide until product/commercial owners approve exact tier matrix |
| Sales/ROI/conversion/staffing improvement | Copy implies outcomes; no controlled case evidence | Frame as decisions supported; cases need baseline, denominator, period, method, limitation |
| 20 active cities / deployed across Indonesia | Hard-coded fallback and static phrase, provenance missing | Do not present as proof without verified records/date |
| Customer logos | Component/schema exists; local asset/consent ledger absent | Render only permissioned, current customer records |
| Real sample demo data | Claimed, but preview is placeholder and provenance absent | Label source/sample status and verify external demo before link |
| Support reply in minutes / 24 hours | Static promise, monitoring/SLA UNKNOWN | Replace with uncommitted response wording or approved service expectation |
| YOLOv8, DeepSORT, GDPR/fire-code and generated OG metrics | Present in generator script, outputs absent, product proof UNKNOWN | Block generator until claims are removed or approved |

### 8.3 Recommended message hierarchy

1. Retail or Mall.
2. Compatible camera stream → aggregate traffic/spatial signal.
3. The decision the buyer can review.
4. How assessment, calibration, processing, and reporting work.
5. Real product view and explicit sample/proof status.
6. Capability/entitlement/prerequisite matrix.
7. Privacy, retention, integration, installation, and support boundaries.
8. One permissioned segment case, when available.
9. Site-fit demo with clear inputs and outputs.

## 9. Trust Audit

### 9.1 Existing positive signals

- Payload collections and visibility controls exist for several public content types.
- Contact/demo submissions use Zod validation, honeypot, per-email quota, persistence, and escaped email output in [submitForm.ts](/home/admin/smartcounter-compro/src/app/actions/submitForm.ts:7).
- Google Analytics loading is consent-aware in [ConsentAnalytics.tsx](/home/admin/smartcounter-compro/src/components/analytics/ConsentAnalytics.tsx:16).
- Canonical, hreflang, Organization/WebSite/SoftwareApplication helpers, sitemap, and robots exist.
- The FAQ fallback contains an honest validation/compatibility direction worth promoting to the main narrative.
- The build, lint, type check, and tests are green.

### 9.2 Must-have before public release

- Verified legal/product name, address, email, phone/WhatsApp, office/support hours, and accountable owner in SiteSettings.
- One content authority: Payload for marketing content; dictionaries for UI labels; neutral, safe fallbacks only.
- Claim/capability ledger applied to Payload, dictionaries, hard-coded fallback, metadata/schema, seed routes, alt/captions, and generated images.
- Placeholder blocker for `Content placeholder`, `[Dashboard Preview]`, `[Featured Image]`, `62XXX`, known test video IDs, missing media, and sample/default records.
- One real redacted dashboard overview or, if unavailable, a clearly labeled approved architecture visual.
- Clear `Illustrative sample data` treatment for every remaining mockup; no named client/location.
- Accuracy validation method, compatible-input prerequisites, and deployment workflow.
- Approved product data-flow statement: source, processing, retained output, retention/deletion, access, and contact/DPA path.
- One consistent package/scope model or no public Packages route.
- Demo promise, external destination, response expectation, sample data, form owner, and inbox delivery verified.
- Privacy/consent language linked from forms; server-side origin/abuse controls appropriate to risk.
- EN/ID completeness and consistency across public routes, Payload Admin, SEO, sitemap, and API; KO/JA/ZH remain inactive and follow an approved redirect/noindex policy.

### 9.3 Nice-to-have after the credible MVP

- One permissioned Retail case and one Mall case.
- Real installation/calibration photography.
- Customer-logo proof fields: permission, customer status, module/site scope, date, expiry/review.
- Deployment-location provenance: source, active date, deployment type, permission.
- Integration/API technical one-pager.
- Named implementation/support team and escalation path.
- ROI worksheet only if assumptions are visible and no result is guaranteed.

### 9.4 Never use without evidence/permission

`#1`, `first`, market leader, accuracy/uptime percentage, ROI or uplift, store/city/device count, `100% compliant`, universal no-PII/no-image, GDPR/SOC/ISO/fire-code claims, algorithm/model names, customer logos/names/quotes, unlimited zones, universal API/integration, universal real time, fixed installation duration, guaranteed support response, or generated people/product/customer proof.

## 10. Asset Gap Analysis

Local Git file inventory contains only [the wordmark](/home/admin/smartcounter-compro/public/brand/smartcounter-logo.png), [favicon](/home/admin/smartcounter-compro/public/favicon.svg), and `llms.txt`. Payload supports media, but no real screenshots, photos, diagrams, videos, case assets, or OG outputs are checked into this clone.

Second Memory records a prior release with 287 media files and 29 active client-logo records outside Git (`[[SmartCounter Web Client Logo and Company Profile Release 2026-07-30#Database and media]]`). That is historical delivery evidence, not proof that the assets are present, permissioned, current, or suitable here. The first asset task is therefore inventory/recovery and provenance review—not automatic recreation.

| Asset category | Current local state | Classification | Risk/decision |
|---|---|---|---|
| Wordmark/favicon | Real local files, no responsive/light/dark lockup family | Usable / improve | Keep; add variants only if small-size/theme use requires them |
| Feature dashboards | 12 hard-coded JSX/SVG mockups | Improve/replace | Useful as wireframes, unsafe as evidence |
| Heatmap visual | Duplicate hard-coded mall heatmap SVG | Replace/label | Named location/value can imply real deployment |
| Hero product media | Missing | P0 gap | Category is clear but product reality is not |
| Deployment photography | Missing | P0 gap | Local implementation/support remains abstract |
| Architecture/privacy diagram | Missing | P0 gap | Evaluators cannot inspect mechanism/data boundary |
| Demo preview/video | Literal placeholder; external demo link | P0 replace | Highest-intent route promises more than it shows |
| Customer logos/cases | Runtime CMS capability; historical release recorded 29 active logo records, but this clone has no assets/permission ledger | Recover / verify | Recover eligible media, then require current permission and context before publication |
| Deployment map | UI component plus hard-coded fallback cities | UI usable, evidence unsafe | Require verified data or remove |
| Blog/OG assets | Referenced/generated outputs absent | Replace/hold | Broken/placeholder visual system and risky generator claims |
| Functional icons | Lucide | Usable | Keep for controls; no custom icon project needed for MVP |
| CSS glows/grid | Coherent decoration | Usable selectively | Keep as background language, never proof |

Asset rule: **real screenshots/photos prove; approved diagrams explain; generated or synthetic visuals decorate. These roles must never blur.**

## 11. Asset Production Plan

The plan is intentionally smaller than a full 12-feature asset program.

Before producing new assets, reconcile any authorized copy of the historical `shared/media` archive and Payload media records against the current requirements. Reuse only files with confirmed origin, permission, current relevance, and safe content.

| Priority | Asset | Purpose / use | Format | Required medium | Must not contain |
|---|---|---|---|---|---|
| P0 | One dashboard overview + three anchor views: Traffic, Flow/Heatmap, Operations/Occupancy | Hero, Home decision groups, Features, Demo | AVIF/WebP + PNG fallback; 16:10 | **Real redacted product screenshots** | PII, credentials, invented metrics, unauthorized site names |
| P0 | Demo poster | Show exactly what the walkthrough contains | WebP/AVIF; 16:10 | **Real sample-data product screenshot** | Literal placeholder, fake live status |
| P0 | Three deployment photos: entrance/camera context, calibration, operator/report | Home, Retail/Mall, Contact/company | AVIF/WebP/JPEG; 3:2 and 16:9 | **Real photography** | Stock/AI people, unconsented face/site/logo |
| P0 | One combined how-it-works/data-boundary diagram | Home + Deployment + Privacy | SVG + PNG; 16:9 | **Engineering/privacy-approved diagram** | Unverified edge/cloud/encryption/retention/compliance claim |
| P0 | Neutral illustrative-label treatment | Existing mockups that temporarily remain | UI label/caption component | Text/system change | Named real locations or ambiguity about sample status |
| P0 | Accurate social preview for Home, Retail, Mall, Features, Deployment, Privacy, and Demo | SEO/social sharing | 1200×630 WebP/PNG | Typographic + approved product crop | Unregistered numbers/logos/claims |
| P1 | One Retail case pack | Retail page proof | Photo + screenshot/chart; 16:9/4:3 | **Permissioned real evidence** | Anonymous uplift without method |
| P1 | One Mall case pack | Mall page proof | Photo + floor/zone output; 16:9/4:3 | **Permissioned real evidence** | Tenant/site details without consent |
| P1 | Verified logo normalization | Optional case/proof strip | SVG/PNG/WebP; normalized canvas | Approved customer art | Logos without current permission/context |
| P1 | Short product walkthrough | Demo and sales handoff | MP4/WebM + captions/transcript/poster; 16:9 | **Real screen recording** | Autoplay audio, fake interactions/data |
| P2 | Spatial path/zone/count texture | Distinctive section transitions | SVG/CSS preferred | Illustration; GPT-image candidate only for texture | Dashboard, people, metrics, customer context |
| P2 | Editorial concept art | Future reviewed resources | WebP/AVIF; 16:9 | Clearly illustrative | Fake case/product proof |

Every asset record needs owner, source/capture date, real/redacted/illustrative status, permission, route, alt/caption, crop, file-size target, and review/expiry date.

## 12. Recommended Sitemap

Use the recorded dual-solution contract with the user's EN/ID override. In the tree below, `[locale]` means only `en` or `id`.

```text
/[locale]
├── /solutions/retail
├── /solutions/mall
├── /features
├── /deployment
├── /privacy
├── /faq
├── /contact
└── /demo
```

| Route | Purpose | Audience | Primary message | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|
| `/[locale]` | Category, mechanism, Retail/Mall choice, proof status, conversion | All | Compatible camera streams become defined aggregate signals for operations | Request site-fit demo | Choose Retail/Mall |
| `/[locale]/solutions/retail` | Retail hierarchy, workflow, metrics, prerequisites, proof | Retail buyers/users | Understand traffic/movement for specific store decisions | Discuss a retail site | Explore Features |
| `/[locale]/solutions/mall` | Mall hierarchy, gate/floor/zone/tenant workflow | Mall buyers/users | Understand supported mall spatial/occupancy signals | Discuss a mall deployment | Explore Features |
| `/[locale]/features` | Retail/Mall toggle, capability groups, definitions, availability, requirements | Product/technical evaluators | What each metric means, requires, outputs, and supports | See representative demo | Compare Retail/Mall |
| `/[locale]/deployment` | Assessment, topology, calibration, validation, handover, requirements | Operations/technical evaluators | How a deployment is scoped and validated | Request technical assessment | Review Privacy |
| `/[locale]/privacy` | Purpose, processing, aggregate outputs, access, retention, deletion, limitations | IT/privacy/legal | What data handling is approved and what remains deployment-specific | Request technical assessment | Contact company |
| `/[locale]/faq` | Accuracy, compatibility, integration, commercial scope, support objections | Technical/commercial evaluators | Concise answers plus links to Deployment/Privacy | Request assessment | Contact company |
| `/[locale]/contact` | Verified company identity plus general contact | Procurement/all | Who operates SmartCounter and how to reach the correct team | Send message | WhatsApp if verified |
| `/[locale]/demo` | Retail/Mall-qualified product/site-fit conversion | High-intent buyers | What the selected demo covers, required context, and expected outcome | Submit request | View relevant solution |

Decisions:

- Hide/noindex `/packages` until one approved commercial taxonomy exists.
- Preserve stored package records; hiding navigation is not permission to delete commercial data.
- Keep Blog out of primary navigation until at least one reviewed, sourced article with real media and an editorial owner exists. Existing approved English articles may remain indexable after the content gate passes.
- Do not add `/customers`, `/technology`, `/security`, or a separate `/about` for MVP. Put proof inside Retail/Mall, deployment truth in Deployment, data handling in Privacy, and verified company identity inside Contact.
- English and Indonesian are active and indexable across public content, Payload, SEO, sitemap, and API. The public switcher shows only EN/ID. KO/JA/ZH remain inactive until separately approved and must not silently fall back into indexable pages.
- Do not restore a top-level `Solutions` menu. Retail/Mall discovery lives in the Home gateway, Features context, Use Cases, contextual CTAs, and footer links.
- Fix `/about` redirect semantics; a missing page should not permanently redirect to unrelated Features content.

## 13. Homepage Composition

Seven sections maximum:

| # | Section | Purpose | Content | Visual | Interaction | CTA |
|---:|---|---|---|---|---|---|
| 1 | Hero | Pass five-second test | Category, Retail/Mall, compatible-stream mechanism, deployment caveat | Real dashboard overview + one authentic entrance crop | No required animation | Request site-fit demo; Retail/Mall links |
| 2 | How it works | Explain physical-to-data bridge | Assess camera/site → validate/calibrate → aggregate metrics → dashboard/report | Approved combined architecture/data-boundary diagram | Static steps; optional focus highlight | Read technical FAQ |
| 3 | Retail vs Mall | Route to buyer-specific story | Two jobs, users, outputs, prerequisites | Real/approved segment context | Two accessible cards, no carousel | Explore Retail / Explore Mall |
| 4 | Three decision groups | Replace 12-feature overload | Traffic; Flow & Zones; Operations—with definitions and availability caveat | Three real product crops | Accessible tabs optional; default content visible | Explore Features |
| 5 | Evidence & limits | Build calibrated trust | Validation method, sample-data label, data boundary, case if approved | One real screenshot; one case card only when ready | Static | Review evidence / FAQ |
| 6 | Demo promise | Convert with clarity | What buyer shares, what SmartCounter shows, what fit decision follows | Demo poster | Direct link to form | Request site-fit demo |
| 7 | Top objections + company footer | Resolve blockers and establish identity | Four FAQ items, verified company/contact/legal links | Minimal | Native disclosures | Contact |

Remove from Home for MVP:

- generic Pain Points cards;
- unverified deployment map; include recovered client logos only inside the evidence section after asset, permission, customer-status, and context verification;
- separate Heatmap promotion;
- package teaser;
- blog preview;
- all 12 feature items;
- decorative autoplay/perpetual motion;
- theme control from the crowded mobile header row; retain the existing light/dark/auto capability inside the menu or another non-blocking placement.

## 14. Design Direction

### 14.1 Design principle

**Physical space, made inspectable.** SmartCounter should look like an operational instrument rather than a generic AI landing page. Red gates, paths, zones, counts, and time are explanatory vocabulary; real product/deployment evidence is the visual center.

### 14.2 Keep / remove / introduce

| Keep | Remove/reduce | Introduce |
|---|---|---|
| Signal Red and neutral zinc palette | Theme control crowds the mobile header and theme curation is uneven | Preserve light/dark/auto, curate both intentionally, and move mobile control inside the menu |
| Wordmark and functional Lucide icons | Times New Roman fallback; render-blocking unused font | Bundle Instrument Sans through Next.js with a predictable system fallback |
| Dark Feature/Use Case spotlight composition | Named/hard-coded sample data posing as proof | Real product screenshots and explicit sample/proof captions |
| Subtle red grid/glow as atmosphere | Every-section card treatment, large radial empty areas | 12-column evidence layout and stronger editorial hierarchy |
| Existing locale/routes/form foundation | Hover-first instruction and 600 ms reveal dependency | Click/tap/keyboard states, content visible by default |
| Red action hierarchy | Too many top-level nav choices on mobile | Retail/Mall routes and one primary Demo action |

### 14.3 Foundations

- **Color:** keep `#DC2626` Signal Red for primary action, active gate/path, and critical emphasis. Use off-white/light-zinc for the document and near-black panels for product evidence. Data colors must be semantic and distinguishable, not a rainbow icon set.
- **Typography:** use Instrument Sans as the single primary family; use Fira Code only for compact data labels. Define responsive sizes and readable line length. Do not add another display font.
- **Layout:** 12-column desktop, 8 px spacing foundation, 1200–1280 px max width; 1-column mobile. Use fewer, larger evidence compositions rather than many small cards.
- **Shape:** 10–16 px radius for product panels/cards; fewer pills; restrained border/shadow. Current very large rounded/glass panels should be reserved for hero evidence.
- **Product figures:** consistent crop, annotation, caption, sample/proof status, time range, metric unit, and redaction.
- **Photography:** real entrance, camera, calibration, mall/store, and operator context; no generated staff/customer imagery.
- **Illustration:** SVG paths/zones/data flow only when it clarifies a relationship.
- **Charts:** label unit, time window, location scope, numerator/denominator where relevant, and `sample` vs `real aggregate` status.

### 14.4 Motion

- Motion purpose must be `orient`, `explain`, `confirm`, or `transition`.
- UI feedback: 150–250 ms, ease-out; transform/opacity; press scale around `0.97`.
- Content starts visible. Scroll animation is progressive enhancement and never gates comprehension.
- A trajectory/zone animation may explain physical-to-data flow; it must end and have a static reduced-motion state.
- No perpetual pointer bounce, scroll-jacking, parallax, particle loop, or synchronized card wave.
- Hover only on fine pointers; tap/keyboard state is primary.

## 15. Differentiation Opportunities

### 15.1 Own the physical-to-decision bridge

```text
Physical context
entrance / floor / zone / route
          ↓
validated aggregate signal
count / traffic / dwell / occupancy
          ↓
defined product output
dashboard / report / comparison
          ↓
buyer decision
staffing / layout / campaign / leasing / operations
```

Use this sequence repeatedly. Each page should answer: what space, what input, what metric, whose decision, which limitation, what evidence?

### 15.2 Evidence-led differentiation hypotheses

| Hypothesis | Why it can matter | Validation gate |
|---|---|---|
| Indonesia-focused implementation/support | Local deployment reduces coordination risk | Verified team, process, response scope, and cases |
| Compatible CCTV reuse | Can reduce installation friction | Approved compatibility matrix and site-assessment examples |
| Retail/Mall operating semantics | More useful than generic “all industries” | Separate job/metric/capability models and buyer interviews |
| Transparent validation | Counters competitor hype | Manual-sample protocol, exceptions, sample report, owner/date |
| Transparent data boundary | Accelerates IT/legal evaluation | Approved processing/retention/access/deletion statement |

### 15.3 Not a differentiator

- `AI-powered` repeated across every section.
- Number of analytics cards.
- A 3D globe/map without verified data.
- Dark mode toggle.
- Unsupported accuracy/ROI/customer metrics.
- Five locales with fallback English.
- Decorative motion or synthetic dashboards.
- A thin blog maintained only for navigation symmetry.

## 16. P0 / P1 / P2 Improvement Backlog

### P0 — truth, clarity, and complete critical paths

| Priority item | Why P0 | Definition of done |
|---|---|---|
| Recover later local work | Vault records a QA-clean dual-solution/hardening working tree that was never committed and is absent here | Authorized backups/worktrees/patches are searched; valid Retail/Mall/hardening work is reused, while English-only locale removal is excluded; otherwise absence is recorded before reimplementation |
| One content/claim authority | Static/Payload/fallback copy conflicts | Payload governs marketing content; dictionaries hold UI labels; rendered-output claim/placeholder gate passes |
| Package reconciliation | Same page exposes incompatible tier names/scope | One approved taxonomy/entitlement matrix, or Packages hidden/noindex |
| Placeholder and fake-proof containment | Current FAQ/demo/blog/map/mockups can mislead | No placeholder tokens; map fails closed; mockups labeled neutral sample or replaced |
| Retail/Mall + three-group IA | Feature/format breadth obscures primary buyers | Home exposes a Retail/Mall gateway; `/{en,id}/solutions/retail`, `/{en,id}/solutions/mall`, and Features context are canonical; Home ≤7 sections |
| Minimum real evidence | Trust is currently 3/10 | One approved dashboard overview + three product views, one data-flow diagram, one deployment context image |
| Demo/Contact truth | Forms exist but promises/contact/provenance are unverified | Verified SiteSettings, form owner/inbox, privacy text, success/error, response wording, demo destination/sample status |
| EN/ID completion | Current five-locale code and incomplete Indonesian content conflict with the approved two-language target | Public, Payload, SEO, sitemap, and API support complete EN/ID; switcher exposes only those languages; KO/JA/ZH are inactive; no mixed-language output |
| Type/visibility/accessibility basics | Serif bug and opacity-0 content make the polished UI unreliable | Fira applies; content visible without JS; labels/ARIA/focus/error states pass critical tests |
| SEO metadata basics | Home title duplicates brand and fallback host can drift | Single brand suffix, explicit release host, accurate schema/OG, FAQ schema matches content |

### P1 — evaluation depth and measurable conversion

| Item | Outcome |
|---|---|
| One permissioned Retail and one Mall case | Converts abstract capability into segment evidence |
| Capability/entitlement matrix | Technical/commercial evaluators know available/configured/assessment/add-on states |
| Validation, compatibility, privacy detail | Site-fit and procurement objections have inspectable answers |
| Six-event conversion funnel | CTA, segment, feature, demo/contact start/success/error become measurable without PII |
| CMS reliability/publication controls | Draft pricing/category records cannot leak; detail routes/sitemap degrade safely on DB failure |
| Asset/performance optimization | Real media remains fast; map/font/scripts load only where needed |
| EN/ID editorial QA | Both canonical languages communicate approved product truth consistently across public, Admin preview, metadata, schema, and API |

### P2 — polish after credibility is proven

| Item | Outcome |
|---|---|
| Spatial path/zone motion | Clarifies data flow and builds visual distinctiveness |
| Responsive brand lockups | Improves small header/footer/social use |
| Additional cases/resources | Added only when evidence/editorial ownership exists |
| More locales | Added only after an explicit decision and full content/API/SEO/support readiness exist |
| Interactive demo/ROI worksheet | Added only when product stability, privacy, assumptions, and measured demand justify it |

## 17. PRD — SmartCounter Payload Company Profile Revamp

### 17.1 Executive Summary

Revise the existing Next.js/Payload company-profile project into a smaller, evidence-led **EN/ID** marketing site for Retail and Mall buyers. Preserve the working stack, CMS, form persistence, SEO helpers, theme system, and visual foundations. Recover the later uncommitted dual-solution/hardening work if possible while excluding English-only locale removal; then remove or hide unready content, make every public capability/claim traceable, replace ambiguous synthetic proof with real or explicitly illustrative assets, and measure the qualified demo journey.

The core release has nine surfaces in each approved locale: Home, Retail Solution, Mall Solution, Features, Deployment, Privacy, FAQ, Contact, and Demo. Packages remain hidden while commercial scope is unresolved. Blog stays outside primary navigation until its content/evidence gate passes.

**Primary outcome:** a target buyer can understand, trust, and evaluate SmartCounter enough to request a relevant site-fit demo.  
**Current local baseline:** 5.0/10, category clarity 6.5/10, immediate trust 3/10.  
**Implementation principle:** recover → diff → reuse → minimally implement; do not replatform.

Required decision owners:

- Product: capability and terminology truth.
- Sales/Commercial: package, hardware/install, response, and service scope.
- Engineering/Solutions: compatible inputs, processing, validation, integration, and demo truth.
- Privacy/Legal: identity, form privacy, product data boundary, customer permission.
- Marketing/Content: complete human-reviewed EN/ID copy, evidence record, SEO, case/resource quality.
- Design/Frontend: hierarchy, product evidence, responsive/accessibility/performance.

### 17.2 Background

The current `49f4d52` checkout already provides:

- localized routes and root locale redirect;
- Payload collections for features, use cases, pricing, FAQ, posts, categories, logos, locations, media, and submissions;
- shared header/footer/theme/locale components; the target narrows them to EN/ID and removes silent fallback;
- structured Home, Features, Use Cases, Packages, FAQ, Blog, Contact, and Demo pages;
- server-side form validation, honeypot, quota, persistence, and email attempt;
- consent-aware Google Analytics loading;
- metadata, canonical/hreflang, schema, sitemap, robots, SEO audit/admin utilities;
- reusable dark product spotlight and spatial visual primitives.

The problem is not absence of a marketing application. It is that the application lacks a reliable boundary between approved truth, CMS data, fallback copy, sample visuals, and placeholders.

Local rendered/content evidence includes:

- two configured FAQ records with placeholder answers;
- two configured package cards and a separate three-tier fallback comparison;
- hard-coded fallback deployments and product mock values;
- incomplete ID dictionary merged with English arrays in the current checkout; the target removes this path rather than completing it;
- real Demo/Contact forms but unverified response/demo promises;
- missing real media and company/proof content;
- typography token failure and JS-dependent hidden content;
- green build/lint/type/test foundations.

Second Memory records a later, QA-clean but uncommitted working tree with Retail/Mall solution pages, Deployment, Privacy, product-truth CMS fields, structured solution-aware demo qualification, and additional route/security hardening. Because that source tree is absent here, those records are **requirements and recovery leads**, not features credited to the current score. Its English-only deletion work is intentionally excluded by the current user decision. See `[[SmartCounter Web Retail and Mall Dual-Solution Expansion 2026-07-31#Repository and release boundary]]` and `[[SmartCounter Web English-Only dan Deep Bug Hunt 2026-08-04#Batas status]]`.

### 17.3 Problem Statement

Target buyers can identify the category but cannot reliably distinguish:

1. supported capability from generic/fallback marketing copy;
2. real product/customer evidence from an illustrative mockup;
3. configured Payload content from hard-coded resilience data;
4. Retail workflow from Mall workflow;
5. package entitlement from an unapproved comparison table;
6. exact privacy/deployment facts from broad assurances;
7. an owned Demo promise from a placeholder/external experience.

The result is a credibility ceiling: the website looks polished enough to invite scrutiny but does not yet provide the evidence or consistency needed to survive that scrutiny.

### 17.4 Product Positioning

**Position:** people counting and aggregate visitor/spatial analytics for Retail and Mall operations using compatible CCTV/video streams.

**Brand architecture (VAULT DECISION):** one SmartCounter brand under `Intelligence Visitor Behavior`, with Retail Intelligence and Mall Intelligence as distinct operating contexts. The slogan remains unchanged; it must not be expanded into an accuracy, AI-model, or outcome promise.

**Default headline:**

> Visitor traffic and movement analytics for retail stores and malls.

**Default support copy:**

> SmartCounter turns compatible camera streams into aggregate signals for defined operating decisions. Available metrics, update frequency, and performance are confirmed for each deployment.

**Retail message:** understand supported traffic and movement signals across stores for operational review.

**Mall message:** understand supported entrance, floor, zone, occupancy, and tenant-area signals for mall operations and commercial review.

**Technical message:** assess camera/site fit, validation, processing/data handling, outputs, integrations, and support before rollout.

**Prohibited positioning without evidence:** market leadership, guaranteed accuracy/ROI/uplift, universal compatibility/real time, absolute privacy/compliance, customer/deployment scale, or technical algorithm names.

### 17.5 Goals

| Goal | Metric | Target |
|---|---|---|
| Make the product immediately understandable | Moderated five-second test | ≥80% identify people/visitor analytics, Retail/Mall audience, and Demo next step |
| Eliminate misleading/unready content | Rendered route audit | 0 placeholder tokens; 0 synthetic visual without sample label; 0 hard-coded proof presented as real |
| Govern public truth | Claim/capability audit | 100% risky claims and public capabilities map to an approved record or are removed |
| Create a focused buyer journey | Homepage/IA audit | ≤7 homepage sections; Retail and Mall each reachable in one action; one primary CTA |
| Establish minimum product proof | Asset acceptance | 1 dashboard overview + 3 anchor views + 1 approved how-it-works/data diagram + 1 authentic deployment/context image |
| Make EN/ID complete | Locale/API/route audit | Both locales are complete, canonical, reciprocal, and human-reviewed across public/Admin/API content; 0 silent mixed-language output |
| Make conversion operational | Form/event reconciliation | Demo and Contact success equals confirmed server persistence/delivery; required events fire once without PII |
| Meet critical accessibility | Manual + automated review | WCAG 2.2 AA critical flows; 0 critical axe/keyboard/screen-reader blocker |
| Meet experience performance | Production field/lab | p75 LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 for Home, Retail, Mall, Features, Deployment, Privacy, Demo |
| Establish a conversion baseline | Analytics + Sales reconciliation | Four clean weeks, then agree a qualified-demo improvement target; suggested first target +20% relative in eight weeks |

### 17.6 Non-Goals

- Replatforming away from Next.js/Payload.
- Building or redesigning the SmartCounter operational dashboard/Super App.
- Publishing public pricing before commercial scope is approved.
- Building a customer portal, public real-time dashboard, digital twin, 3D globe, chatbot, or ROI engine.
- Publishing one page per feature at MVP unless existing detail pages have approved unique content/evidence.
- Launching KO/JA/ZH as active public, Admin, SEO, sitemap, or API locales.
- Producing twelve screenshots before capability truth is known.
- Creating a separate Customers, Security, Technology, Resources, or About route without enough real content.
- Redesigning the logo.
- Proving product accuracy, privacy compliance, or business outcomes through copy alone.

### 17.7 Target Audience

#### Retail buyer

- Roles: retail COO/operations leader, regional manager, store operations, merchandising/VM, marketing, BI.
- Questions: traffic trend, entry/exit, dwell/zones, store comparison, staffing/layout/campaign use, POS/conversion relationship.
- Conversion intent: representative product walkthrough and site-fit assessment.

#### Mall buyer

- Roles: mall GM, operations/asset, leasing/tenant relations, marketing, BI.
- Questions: entrance/floor/zone/tenant scope, occupancy, events/campaigns, multi-floor topology, privacy, reporting.
- Conversion intent: technical/deployment walkthrough for a representative mall context.

#### Technical evaluator

- Roles: IT/infrastructure, security, privacy/legal, facilities, integration/BI.
- Questions: stream compatibility, placement, lighting, network, processing, retention, access, validation, integration, offline behavior, support.
- Conversion intent: technical assessment and approved documentation.

#### Executive/commercial evaluator

- Roles: executive sponsor, procurement, finance.
- Questions: fit, proof, total scope, risks, service terms, rollout phases, outcome measurement.
- Conversion intent: qualified proposal after product/site fit is established.

### 17.8 User Journey

#### Primary path

```text
Land
  ↓
Understand category + Retail/Mall fit
  ↓
See how camera/site becomes a defined metric
  ↓
Inspect real product view + proof/sample status
  ↓
Evaluate capability, prerequisites, privacy, integration, and limitations
  ↓
Request site-fit demo
  ↓
Receive confirmed submission and next-step expectation
```

#### Retail path

Home → Retail → selected decision group → validation/FAQ → Demo with Retail context.

#### Mall path

Home → Mall → floor/zone workflow → deployment/privacy/FAQ → Demo with Mall context.

#### Technical path

Features, Deployment, Privacy, or direct FAQ → compatibility/validation/data boundary/integration → Contact or technical Demo.

#### Failure/recovery behavior

- Unsupported/unknown capability displays `Requires assessment` rather than disappearing or overpromising.
- Empty proof, logo, map, package, case, or article collections do not render fabricated fallback evidence.
- Payload/database failure returns approved cached/neutral content or a controlled response; dynamic routes and sitemap never expose an uncaught application error.
- Form failure preserves safe input, identifies the problem, announces it accessibly, supports retry, and does not emit success.
- External demo failure never blocks the owned Demo request path.
- Declining analytics consent never blocks content or forms.

### 17.9 Information Architecture

Primary navigation:

```text
Features | Use Cases | Deployment | Privacy | Contact | [Request Demo]
```

Retail and Mall are not restored as a `Solutions` dropdown. They are explicit choices in the Home gateway, Features context, Use Cases, relevant CTAs, and footer. `[locale]` below means `en` or `id`:

- Retail → `/[locale]/solutions/retail`
- Mall → `/[locale]/solutions/mall`
- Features → `/[locale]/features`
- Deployment → `/[locale]/deployment`
- Privacy → `/[locale]/privacy`
- FAQ → `/[locale]/faq` through footer/contextual links
- Contact → `/[locale]/contact`
- Request Demo → `/[locale]/demo`

Rules:

- One primary header CTA.
- Locale switch exposes EN/ID only and preserves the equivalent route where available.
- Preserve the existing light/dark/auto theme capability. On mobile, place locale and theme controls inside the menu so they do not crowd the primary header row.
- Hide Packages and Blog from main/footer navigation until their readiness gates pass.
- Do not show an empty Client/Case/Map section.
- Breadcrumbs only on detail/article pages.
- External Retail demo is secondary and appears only when ownership, availability, privacy, and sample status are approved. Mall never inherits the Retail self-service destination.

### 17.10 Page Requirements

| Page | Purpose | Audience | Required sections | Content requirement | Asset requirement | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|---|---|
| Home | Explain and route | All | Hero; how it works; Retail/Mall; 3 decision groups; evidence/limits; demo; FAQ/footer | One position, no package/proof fallback | Real overview, context photo, data-flow diagram | Request site-fit demo | Retail / Mall |
| Retail | Explain store workflow | Retail | Job; journey; metrics; UI; validation; prerequisites; proof status; CTA | Retail-specific metric/decision semantics | Traffic/flow UI + retail context | Discuss retail site | Features |
| Mall | Explain mall workflow | Mall | Stakeholders; topology; metrics; UI; deployment/privacy; proof status; CTA | Mall-specific floor/zone/tenant semantics | Mall context + floor/zone visual | Discuss mall deployment | Features |
| Features | Define capabilities | Users/evaluators | Retail/Mall toggle; 3 groups; capability matrix; definitions; prerequisites; samples; related use cases | Status, unit, decision, limitation per capability | 3 real anchor views | See representative demo | Retail / Mall |
| Deployment | Explain implementation truth | Operations/technical | Topology; assessment; design; installation; calibration; validation; handover; requirements | Deployment-specific facts and explicit unknowns | Approved workflow/topology diagram + real context image | Request assessment | Privacy |
| Privacy | Explain product data boundary | IT/privacy/legal | Purpose; input; processing; aggregate output; access; retention/deletion; responsibilities; limitations | No universal certification or architecture assumption | Approved data-flow diagram | Request assessment | Contact |
| FAQ | Answer evaluation blockers | Technical/commercial | Accuracy; compatibility; integration; commercial scope; support; links to Deployment/Privacy | Cautious approved answers only | Optional excerpts from approved diagram | Request assessment | Contact |
| Contact | Establish identity and contact | All/procurement | Company identity; operating scope; verified contacts; office/support; form; privacy link | Verified SiteSettings, no hard-coded defaults | Real team/office/deployment context optional | Send message | WhatsApp if verified |
| Demo | Convert and qualify | High intent | Promise; deliverables; qualification; form; real preview; privacy; next step | Only measured/owned duration/response/sample claims | Real demo poster | Submit request | Relevant solution |

Common page requirements:

- one H1 and logical heading order;
- content visible without JS/motion;
- explicit `real`, `redacted`, or `illustrative sample` media status;
- one primary CTA and context-relevant secondary action;
- EN/ID human review state;
- canonical, hreflang, title, description, OG, and schema based only on visible approved content;
- analytics events and owner/review date;
- safe empty/error/conditional behavior.

### 17.11 Homepage Requirements

Required:

- audience-neutral category headline and compatible-stream mechanism;
- Retail/Mall entry paths in the first viewport or immediately after it;
- one real redacted product overview and one authentic deployment/context visual;
- concise how-it-works/data-boundary diagram;
- exactly three decision groups at MVP;
- visible statement that feature availability/performance is assessment/package-dependent;
- proof block only when an approved case exists; otherwise show validation/data-boundary facts, not empty logos;
- clear demo deliverable and form link;
- four high-value FAQ questions;
- verified company/contact footer.

Remove:

- generic pain cards;
- fallback deployment map/count;
- empty client-logo region;
- separate heatmap sales section;
- package cards;
- blog teaser;
- twelve-item interactive spotlight from Home (retain the component for Features after truth/label fixes).

Acceptance:

- Home is no more than seven major sections.
- At 390 px, the logo and Demo/menu do not wrap/crop; theme control lives inside the menu and no floating control covers content.
- The page remains understandable with CSS animation disabled, images blocked, or JS unavailable.
- The first product visual has a visible data/provenance caption.

### 17.12 Retail Page Requirements

**Purpose:** help a retail operator decide whether SmartCounter can support a representative store/portfolio workflow.

Required sequence:

1. Retail role/job statement.
2. One verified journey: entrance/traffic → zone/dwell/flow → operational review.
3. Metric definitions: input, unit, time window, user, decision, prerequisite, limitation.
4. Real traffic and flow product views.
5. Camera/site assessment and representative manual validation method.
6. POS/conversion explanation only when denominator/integration are approved.
7. Multi-location comparison only when actually enabled.
8. Data/privacy and deployment summary.
9. Permissioned retail case or explicit evidence status.
10. Retail-prefilled Demo context with role, goal, current hardware, location count, entrances/zones, and deployment scope.

Prohibited: guaranteed revenue/conversion/staffing improvement, universal existing-camera compatibility, unnamed retailer outcome, or synthetic location presented as real.

### 17.13 Mall Page Requirements

**Purpose:** help a mall operator/evaluator understand supported spatial scope and deployment fit.

Required sequence:

1. Mall stakeholders and operating questions.
2. Approved topology: entrances, floors, zones, common areas, tenants—only where supported.
3. Explicit entry-gate versus internal-gate classification; internal floor movement must not become a new mall visit.
4. Metric definitions and ownership/denominator boundaries; total footfall, occupancy, dwell, and unique visitors remain distinct measurements.
5. Real or clearly illustrative floor/zone output.
6. Basic gate/floor analytics separated from GPU-dependent behavior analytics.
7. Occupancy, campaign, leasing, and tenant language framed as review inputs—not promised outcomes.
8. Multi-floor/tenant reporting only with capability/entitlement proof.
9. Camera/sensor/network/GPU/calibration/rollout and configured freshness detail.
10. Permissioned mall case or explicit evidence status.
11. Mall-prefilled site-fit Demo context with role, goal, properties, floors, gates, current hardware, and deployment scope; no Retail self-service link.

The Mall page must not be Retail copy with nouns replaced.

### 17.14 Features / Capability Requirements

Start with one Features route. Do not create twelve public detail pages merely because current components support slugs.

| Group | Buyer question | Candidate capabilities, subject to approval |
|---|---|---|
| Traffic | How many people approach, enter, or exit, and when? | Visitor traffic, in/out, passers-by, entering rate, staff exclusion |
| Flow & Zones | Where do visitors move and spend time? | Dwell, heatmap, zones, routes/journey, group behavior |
| Operations | Where is capacity or service pressure changing? | Occupancy, queue/wait, service efficiency, alerts |

Demographics is not a fourth hero group by default. Publish it only after exact aggregate output, privacy/data handling, accuracy/bias limitations, and package availability are approved.

Each capability record requires:

- stable ID plus human-reviewed English and Indonesian public names;
- `solutionType`: shared, Retail, or Mall;
- public availability: `available`, `deployment-dependent`, `pilot`, `roadmap`, or `not-public`; commercial entitlement remains a separate field;
- technical requirements: CCTV, sensor, GPU, POS, floor plan, network, and any other approved prerequisite;
- input/prerequisite and compatible deployment context;
- output definition, unit, time window, and update behavior;
- measurement scope, data freshness, and concise public capability note;
- Retail and Mall meaning where different;
- user/decision supported;
- limitation and validation note;
- entitlement/package reference;
- real screenshot or explicit illustrative sample;
- content/evidence owner and review date.

### 17.15 Trust / Proof Requirements

#### Claim record

Every risky claim record includes:

- exact approved sentence;
- claim type;
- owner;
- source/artifact;
- definition, numerator/denominator, cohort/site class;
- method and exclusions;
- approval and expiry/review date;
- route/locale/media usage;
- customer/legal permission when applicable.

#### Validation

- Explain scene/site prerequisites and representative manual comparison.
- State how exceptions, groups, staff, occlusion, lighting, or camera changes affect evaluation where relevant.
- Do not collapse deployment-specific validation into one universal accuracy figure.

#### Product data boundary

- Input source and processing location/architecture.
- Fields/outputs retained and time granularity.
- Image/video retention or non-retention, if applicable.
- Access roles, tenant boundaries, export/sharing, deletion, and responsible contact.
- Separate product data from website form/analytics data.

#### Customer/case proof

Each case requires permission, context, setup, period, metric definition, method, result/learning, limitations, real/redacted asset, quote approval, owner, and review/expiry date.

#### Fallback behavior

- Empty logos, locations, cases, FAQ, pricing, or media render an honest omission/neutral state—not seeded proof.
- Hard-coded city/customer/location/metric fallbacks are prohibited on public routes.

### 17.16 Content Requirements

- Payload is the marketing-content authority.
- Dictionaries contain navigation, labels, form/system text, and only approved emergency copy—not independent feature/package/claim catalogs.
- Fallback page content is neutral, short, safe, and clearly controlled; no quantitative, compliance, customer, deployment, or package claim.
- English and Indonesian are the only public/Admin/API content locales. Both require complete reviewed content; missing Indonesian marketing copy blocks publication/indexation rather than silently merging English. KO/JA/ZH remain inactive.
- Voice is calm, specific, operational, and conditional where deployment matters.
- Define measured signal, derived metric, inference/recommendation, and business outcome separately.
- Every public number, capability, service promise, customer name/logo, technical statement, metadata phrase, and generated visual passes the same evidence gate.
- Prohibit placeholders and test fixtures in rendered output.
- Remove `AI-powered` when it adds no buyer-relevant meaning.
- Resource/Blog publication requires author/reviewer, primary sources, date, purpose, real asset, and maintenance owner.

### 17.17 Asset Requirements

- MVP requires only the six P0 assets in Section 11; do not wait for a complete 12-feature library.
- Redaction removes PII, credentials, sensitive customer data, internal hostnames/debug values, and unauthorized locations while retaining legibility.
- Figures include visible caption: what view, what metric/time scope, and `real redacted` or `illustrative sample`.
- No stock/AI-generated people or premises are used as deployment/customer proof.
- Media collection records source, permission, provenance status, owner, localized EN/ID alt/caption where informative, review/expiry, and approved routes/locales.
- Responsive variants match actual use; browser downscaling of a huge source file is not sufficient.
- OG image is 1200×630 and contains no unregistered claim.
- Remove `[Dashboard Preview]`, `[Featured Image]`, missing `/media`/`/og` paths, test video ID, placeholder phone/WhatsApp, and risky generated OG content before publication.

### 17.18 Design System Direction

Required foundation:

- one curated marketing theme: off-white/light-zinc document with near-black evidence panels and Signal Red `#DC2626`;
- Instrument Sans applied through a reliable Next.js font strategy; Fira Code only for data labels;
- 8 px spacing scale, 1200–1280 px max width, 12-column desktop / 6-column tablet / 1-column mobile;
- 10–16 px default radius, restrained border/shadow, consistent focus ring;
- primary, secondary, tertiary/link, and destructive/error action semantics;
- evidence figure, metric definition, capability status, sample/proof caption, disclosure, form, case summary, and company-contact patterns;
- semantic chart tokens, units, empty/error/sample states, and accessible legend treatment;
- no fixed-height copy containers; components tolerate realistic CMS copy and accessible text scaling.

Use the existing Feature/Use Case spotlight as a source pattern after it is simplified, made accessible, and connected to approved media. Do not create a second component system.

### 17.19 Motion / Interaction Guidelines

- Content renders visible; animation changes from complete state to enhanced state, never opacity-0 dependency.
- Functional duration 150–250 ms with ease-out; longer explanatory sequence ≤600 ms and user-triggered.
- Transform/opacity only for routine UI motion.
- Active press scale about 0.97; hover effects restricted to fine-pointer devices.
- Tabs/disclosures expose selected/expanded state and keyboard behavior.
- Trajectory/zone motion is optional and must explain a metric transition.
- Respect `prefers-reduced-motion`; no animation is required for understanding.
- No looping pointer, particles, parallax, scroll-jacking, autoplay audio/video, or simultaneous list reveal.
- Video has user controls, captions, transcript, poster, and pause.

### 17.20 Responsive Requirements

Test 320, 375/390, 768, 1024, 1280, and 1440 px, plus 200% zoom and increased text spacing.

- Header keeps logo and Demo/menu usable without wrapping/cropping.
- Keep EN/ID and theme controls inside the mobile menu instead of the primary header row.
- Minimum touch target 44×44 CSS px.
- Hero proof stays legible and does not become a decorative crop.
- Retail/Mall choice remains visible without horizontal carousel.
- Three decision groups stack into a short sequence.
- Tables become labeled stacked comparisons or an accessible overflow region; text is not shrunk.
- Product screenshots use deliberate mobile crops or an accessible enlarge action.
- Floating WhatsApp never overlaps content/form/CTA/safe areas.
- Forms use suitable input mode/autocomplete and keep help/error adjacent.
- Landscape mobile, keyboard focus, and sticky header are explicitly tested.

### 17.21 Accessibility

Target WCAG 2.2 AA for public routes and critical conversion flows.

- One H1, logical heading order, landmarks, skip link, correct page language/title.
- Native links/buttons and full keyboard operation.
- Mobile menu has `aria-expanded`, `aria-controls`, focus management, escape/close behavior, and focus return.
- FAQ disclosure has accessible name, expanded state, controlled panel ID, and predictable focus.
- Search/category/tabs expose labels and selected/pressed state.
- Form labels use `htmlFor`/`id`; required/help/error use programmatic relationships; invalid state and live success/error are announced.
- Icon-only controls have accessible names; decorative icons/SVG are hidden or titled appropriately.
- AA contrast and non-color chart/state indicators.
- Informative alt/caption and empty alt for decoration.
- Equivalent textual deployment/capability information for map/chart users.
- Content visible without JS/IntersectionObserver and in reduced motion.
- Captions/transcript and controls for video.

Verification combines axe or equivalent, keyboard-only review, screen-reader spot check, zoom/text-spacing, contrast, no-JS, reduced-motion, and form failure/success. Automated scan alone is insufficient.

### 17.22 Performance Requirements

Current local loopback timing is not a production baseline. Collect field/lab data on the release environment.

- p75 targets: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1.
- Hero image target ≤250 KB mobile / ≤400 KB desktop with responsive AVIF/WebP and intrinsic dimensions.
- Lazy-load below-fold screenshots, photos, map, video, and embeds.
- Default video to poster; do not preload full media or autoplay.
- Load Leaflet CSS/chunk only where the map is actually used; prefer no map in MVP Home.
- Apply/self-host/subset the chosen font reliably; remove the unused render-blocking external font path.
- Eliminate hidden-by-default content and long 600 ms reveal delays.
- Load non-essential analytics only after consent and avoid duplicate tags.
- Versioned static assets use long-lived immutable caching.
- Database/Payload queries define timeout/cache/fallback behavior; detail pages and sitemap do not hang or crash on CMS failure.
- Define route JS/third-party budget during implementation based on the retained pages; any exception needs measured value.

### 17.23 SEO Requirements

- Require an explicit release-site URL; do not silently rely on the default canonical host.
- Root locale redirect is documented and tested.
- Index complete English and Indonesian equivalents only; sitemap and HTML expose reciprocal `hreflang=en`, `hreflang=id`, and `x-default`. KO/JA/ZH are absent from the sitemap and follow the approved inactive-locale redirect/noindex policy.
- Fix the duplicate `SmartCounter | SmartCounter` Home title.
- Unique factual title/description/H1/social card per page.
- Sitemap contains every published canonical page, including more than 100 posts if Blog is later enabled; no draft/placeholder/category route leaks.
- Do not emit FAQPage schema. The latest vault contract removed it; visible FAQ content still requires normal semantic HTML and evidence-safe copy.
- Organization/SoftwareApplication schema uses only verified identity, contact, category, and visible claims.
- No schema-only claim or hidden content.
- `/about` redirect maps to equivalent company content or returns a deliberate status; never permanently redirect to unrelated Features.
- OG images are 1200×630 and evidence-safe.
- Images use human-readable filenames and functional alt, not keyword stuffing.
- Pre-release rendered crawl verifies status, canonical, reciprocal EN/ID hreflang, metadata, schema, internal links, robots, sitemap, placeholders, inactive-locale behavior, and mixed language.

### 17.24 Analytics / Conversion Tracking

Keep the event model small and tied to decisions:

| Event | Trigger | Properties | Guardrail |
|---|---|---|---|
| `cta_click` | Primary/secondary CTA activation | locale, page, placement, label, destination, solution | No PII; dedupe |
| `solution_select` | Explicit Retail/Mall selection | locale, solution, placement | Do not infer identity |
| `feature_explore` | User opens/selects a capability group | locale, capability/group ID, solution context | ID from capability registry |
| `demo_start` | First meaningful Demo form interaction | locale, solution, source/UTM | Not on page view |
| `demo_submit_success` / `demo_submit_error` | Server confirms persistence/routing or categorized failure | non-PII correlation ID, locale, solution, error category | Success exactly once; no field values |
| `contact_submit_success` / `contact_submit_error` | Same lifecycle for Contact | locale, reason category, error category | Same PII/dedupe rule |

Requirements:

- Non-essential events fire only after appropriate consent.
- No name, email, phone, company, free-text message, camera URL, or other PII enters analytics.
- Server-confirmed persistence/delivery is the success boundary; button click is not a lead.
- Capture safe UTM/referrer/source with a documented first/last-touch policy.
- Reconcile analytics success with Payload submission and sales qualification.
- Define a qualified Demo with Sales before using conversion as the north-star metric.
- Collect four clean baseline weeks before promising an uplift target.

### 17.25 Acceptance Criteria

#### M0 — Content and evidence truth

- Authorized recovery search for the July 31/August 4 uncommitted work is complete; recovered source is reviewed/diffed or its absence is recorded before reimplementation.
- Rendered-output scan finds zero placeholder/test token, malformed contact URL, risky generator artifact, or mixed-language fallback.
- Every public capability/claim has an approved status/record; all others are removed or labeled assessment-required.
- Package names/features/scope are consistent everywhere or Packages is hidden/noindex.
- Deployment map, customer logos, and case sections fail closed when verified records are absent.
- Every synthetic visual is visibly `Illustrative sample` with neutral data/location; P0 real product assets are approved.

#### M1 — IA and comprehension

- Header stays simple and exposes Features, Use Cases, Deployment, Privacy, Contact, and one Demo CTA; Retail/Mall are one action away through the Home gateway and contextual links without a restored Solutions menu.
- Home contains seven or fewer major sections and no unready Packages/Blog/map/logo module.
- ≥80% of target test participants identify category, Retail/Mall audience, and next step in five seconds.
- Retail and Mall pages each specify buyer, job, workflow, metric definitions, prerequisites, limitations, proof status, and CTA.

#### M2 — Critical experience

- Instrument Sans is computed in production; no unintended Times New Roman fallback.
- All primary content is visible without JS/IntersectionObserver and with reduced motion.
- 320–1440 px plus 200% zoom show no overflow, clipped controls, fixed-widget overlap, or unreadable table.
- Keyboard/screen-reader/axe review has zero critical issue in header/locale/theme, Features interaction, FAQ, Demo, Contact, consent, and footer.
- Forms expose associated labels/help/errors, client/server validation, consent/privacy, success/error/retry, and safe abuse/origin controls.

#### M3 — Operational conversion and reliability

- Test Demo and Contact submissions persist/reach the owned destination once and show the correct state.
- Demo duration, response expectation, external URL, sample provenance, and responsible owner are verified or removed.
- The six event families in 17.24 pass debug QA after consent and contain no PII.
- Empty/database-unavailable behavior for Home/list/detail/sitemap is controlled; no uncaught route error.
- Public Pricing/Category/Post records require explicit publish/visibility state.

#### M4 — SEO and performance

- EN/ID rendered crawl reports only intended canonical 200 routes, reciprocal `en`/`id`/`x-default` hreflang, approved KO/JA/ZH inactive behavior, no duplicate title/placeholder, and correct OG/schema.
- `/about`, Packages, Blog, category, and feature-detail status/indexation match the approved route plan.
- Field/lab key-page CWV meets LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 or has an owner-approved short-lived exception and rollback.
- Hero/below-fold/video/font/map/analytics loading follows the budgets in 17.22.
- `pnpm build`, lint, type check, tests, route smoke, claim/placeholder scan, and accessibility checks pass.

### 17.26 Risks and Dependencies

| Risk/dependency | Owner | Mitigation |
|---|---|---|
| Product capability/entitlement truth is incomplete | Product + Sales/Solutions | Versioned capability/package registry before copy lock |
| No real product/deployment evidence | Product + Field Ops + Customer owner | Produce minimum P0 set; label/omit samples until approved |
| Static/Payload/fallback sources conflict | Engineering + Content | Payload authority + dictionary scope + rendered-output gate |
| Contact/demo promises or destinations unowned | Sales Ops + Engineering | Verify SiteSettings, owner, inbox, external demo, sample provenance |
| Privacy/validation facts not ready | Engineering + Privacy/Legal | One data-flow/validation workshop and approved concise disclosure |
| Later dual-solution/hardening source may be lost | Engineering + repository owner | Search authorized backups/worktrees/patches first; diff recovered work; reuse it without applying English-only locale removal |
| EN/ID content/route drift | Content + Engineering | Completeness checks, reciprocal route/SEO matrix, human review, and CMS scan; no silent language fallback |
| CMS outage can affect dynamic routes/sitemap | Engineering | Explicit timeouts/cache/fallback/controlled response tests |
| Media/map/font/animation regression | Design + Frontend | Minimal asset set, route-scoped loading, CWV/accessibility gates |

### 17.27 Delivery Sequence

1. **Recovery and lineage:** locate/diff the July 31/August 4 working-tree work; record what is reusable and what is missing.
2. **Truth freeze:** capability/package/claim/contact/demo and EN/ID decisions.
3. **Content cut:** hide Packages/unready Blog/unverified proof; remove placeholders and absolute claims.
4. **Foundation repair:** font, content-visible default, form/FAQ/menu accessibility, CMS failure/publication controls.
5. **Evidence production:** recover eligible media, then fill only remaining gaps: overview, three product views, context photo, data-flow diagram.
6. **Composition:** seven-section Home plus Retail, Mall, Features, Deployment, Privacy, FAQ, Contact, Demo.
7. **Instrumentation and QA:** events, submissions, EN/ID crawl/hreflang/API matrix, inactive-locale behavior, accessibility, performance, schema, route smoke.
8. **Release handoff:** separate deployment/migration checklist, monitoring, and rollback.

## 18. Final Verdict

The local Payload candidate is now an estimated **7.5/10 for implemented design, clarity, and engineering quality**, while public proof readiness remains lower because real product, deployment, customer, legal, and privacy evidence is not available in the repository. This is an implementation assessment, not a measured market or production score.

The revamp now provides a truthful seven-section Home, distinct Retail and Mall paths, three decision-led capability groups, first-class Deployment and Privacy pages, buyer-grade FAQ, qualified Demo and Contact forms, strict EN/ID behavior, fail-closed proof, claim governance, evidence-safe conceptual visuals, a restrained design system, consent-aware analytics, and release-oriented SEO/security checks.

An **8/10 public release** still requires approved redacted product evidence, verified company/contact details, an owned email destination, product/privacy fact approval, and release-environment accessibility/performance validation. A **9/10 version** additionally requires permissioned Retail and Mall cases with method, denominator, date, limitations, and measured qualified-demo improvement. It does not require more routes, locales, feature cards, a 3D globe, chatbot, or decorative motion.

The target experience is simple:

> “I know what SmartCounter measures, whether my Retail or Mall situation fits, what is required, what is real versus sample, what the limitations are, and exactly what I will get from a demo.”

## 19. Top 5 Highest-Leverage Actions

1. Replace the conceptual overview and synthetic capability panels with one approved redacted dashboard overview plus Traffic, Flow/Zones, and Operations views.
2. Add one authentic Retail or Mall deployment photo and one technically approved camera/input → processing → aggregate output → dashboard/privacy diagram.
3. Verify legal identity, contact details, `FORM_NOTIFICATION_EMAIL`, support ownership, privacy/retention facts, and the capability/entitlement matrix.
4. Execute non-production Demo/Contact persistence-and-delivery tests plus analytics debug QA with the real measurement configuration and sales qualification owner.
5. Set the release host, run axe/screen-reader and field/lab CWV checks in the release environment, then perform a separately approved migration/deployment with rollback.

## 20. Implementation Compliance Audit

| Gate | Status | Evidence and remaining condition |
|---|---|---|
| M0 — Content and evidence truth | **PARTIAL** | Claim/placeholder audit passes; Packages/Blog/unverified proof fail closed; conceptual media is labeled. Real P0 product/deployment assets and approved product/privacy facts remain blocked externally. |
| M1 — IA and comprehension | **PARTIAL** | Header, seven-section Home, Retail/Mall, Features, Deployment, Privacy, FAQ, Contact, and Demo are implemented. The ≥80% five-second comprehension target still requires user research. |
| M2 — Critical experience | **PARTIAL** | Manual keyboard/browser review, no-JS, reduced motion, form validation, one-H1/heading order, and 320–1440 px reflow pass. Formal axe and screen-reader testing remain release checks. |
| M3 — Conversion and reliability | **PARTIAL** | Validation, persistence code, privacy consent, rate limit/honeypot, event contract, and safe empty states are implemented. No lead was submitted; owned inbox delivery and production analytics remain unverified. |
| M4 — SEO and performance | **PARTIAL** | Build, crawl, canonical/hreflang/OG, redirects, security smoke, internal links, and local lab metrics pass. Production host, field CWV, and deployment remain outside this local task. |

Implementation work is **DONE locally** for the approved code/design scope. Public proof, legal/product approval, owned communications, production measurements, the unreachable `ssh malls` reference, and release authority are **BLOCKED external dependencies**, not facts to infer or fabricate.
