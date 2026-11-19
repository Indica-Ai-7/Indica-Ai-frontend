# Design

## Context

This design follows the MVP scope in `planejamento/PLANEJAMENTO.md`. The application is a React/Vite frontend with a local catalog served over HTTP. The catalog data lives in `db.json`; recommendation matching is performed locally from the request and catalog metadata.

The project has no existing capability specs, so this change defines the first behavior contracts in the accompanying spec deltas.

## Goals / Non-Goals

**Goals:**

- Keep catalog access behind an HTTP client area in `src/api`.
- Separate catalog, title-entry, and recommendation experiences into pages and reusable components under `src/pages` and `src/components`.
- Provide visible loading, empty, error, and unavailable-image states throughout the user flow.
- Keep recommendation matching deterministic, explainable, and local.
- Make the interface responsive and accessible, with a coherent visual system.

**Non-Goals:**

- Production backend, user accounts, cross-device synchronization, or persistent user history.
- External catalog APIs, generative AI, or recommendation services.
- A production deployment architecture for JSON Server.
- Adding advanced motion, smooth scrolling, or WebGL without a demonstrated user-experience benefit.

## Decisions

### Use an HTTP boundary for catalog data

The frontend will read and write catalog entries through an HTTP client in `src/api`; it will not import `db.json` directly. JSON Server will expose the local data during the MVP, keeping the UI independent from the mock server's storage format.

The catalog contract must define required fields, types, stable identifiers, and validation before the initial dataset is consolidated. Data sources and reuse permissions must be verified and documented before their records are included.

The group will approve the exact catalog fields and validation rules during the initial catalog phase, before consolidating data or building the entry form. Until then, the implementation will not assume additional required fields beyond those described in the planning documents.

**Alternative considered:** Importing the JSON file directly into the frontend. This was rejected because it would bypass the required HTTP behavior and would not exercise loading, failure, or write flows.

### Keep recommendation logic local and deterministic

The recommendation flow will normalize the user's text, map recognizable terms to catalog metadata, score and order candidates consistently, and retain the matched criteria for brief explanations. It will distinguish matches from alternatives and provide explicit behavior for empty requests and no useful results.

**Alternative considered:** An external or generative AI service. This was rejected for the MVP because the planning scope calls for local rules and avoids external services.

### Keep the frontend organized by user-facing areas

Pages will represent catalog browsing, entry details, entry creation, and the recommendation conversation. Reusable components will cover repeated presentation such as catalog cards, metadata, form feedback, and recommendation results. The conversational screen will call the local recommendation behavior and link to catalog details.

**Alternative considered:** Building the entire experience in a single page component. This was rejected because it would couple unrelated flows and make the staged implementation harder to review.

### Use the frontend skills as design guidance, not as mandatory dependencies

`design-taste-frontend` will guide the baseline visual system, responsive composition, real product UI, and restrained interactions. `build-awwwards-quality-sites` may guide a deliberately selected hero or motion moment; its motion and media techniques will be used only when they support the product flow. Any additional animation, smooth-scroll, or WebGL dependency must be justified before adoption.

The interface will remain understandable and usable without animation, support reduced-motion preferences, and preserve keyboard focus and clear control states.

**Alternative considered:** Applying every visual effect or dependency from both skills throughout the application. This was rejected to keep the catalog and recommendation tasks focused, performant, and coherent.

### Catalog visual direction

The catalog uses a white editorial ground, near-black text, and a signal-red accent, with Epilogue for interface and display text and JetBrains Mono for compact metadata. The visual identity is built from the catalog itself: category-coded, typographic cover fallbacks keep entries legible when no licensed image is available. The list is the primary screen, with compact type filters, text search, and progressively revealed results; detail pages keep the same header, spacing, and category treatment.

The `design-taste-frontend` system informs hierarchy, responsive layout, keyboard focus, and restrained hover feedback. The `build-awwwards-quality-sites` review found no useful cinematic interaction for a repeated catalog workflow: no GSAP, smooth-scroll, WebGL, or animation dependency is added. A brief CSS entrance and small card hover are supplementary and are disabled for reduced-motion preferences. Catalog images are used only when supplied by the record; missing or failed images use the local typographic cover, without invented artwork.

The group approved this visual direction on 17 November 2026. No cinematic hero interaction was selected; the implementation remains focused on catalog discovery with restrained CSS feedback and reduced-motion support.

## Risks / Trade-offs

- **[Catalog size and reuse rights may block the 200-entry-per-type target]** -> Verify sources and permissions before importing records; record a blocker rather than inventing entries or using unlicensed data.
- **[Local text rules may miss user intent]** -> Limit matching to available metadata, explain recognized criteria, and validate against group-approved example searches.
- **[JSON Server is not a production backend]** -> Treat it only as a local MVP data service and document repeatable startup and validation steps.
- **[Visual-motion scope may compete with required functionality]** -> Complete the core catalog and recommendation states first; add cinematic motion only when it reinforces a specific interaction.

## Migration Plan

No existing production data or deployed service is being migrated. Configure and document local JSON Server startup, validate the catalog contract and data, then implement the frontend against its HTTP interface. If the local mock is replaced later, retain the HTTP client contract and update the service configuration.

## Open Questions

- Which verified data source can provide the planned catalog volume with suitable reuse permissions?
