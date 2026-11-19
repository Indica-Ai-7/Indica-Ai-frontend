# Proposal

## Why

People often spend too much time deciding what to watch, and generic recommendations may not match what they want at that moment. This change defines an MVP that lets users explore a local catalog and receive explainable suggestions from a free-text request.

## What Changes

- Provide a searchable and browsable catalog of films, series, documentaries, animation, and telenovelas, including title details.
- Allow users to add catalog entries with validation and clear success and error feedback.
- Interpret search text locally using catalog metadata, rank matching titles, explain recommendations, and offer alternatives when there is no exact match.
- Provide a conversational interface for submitting a request, viewing recommendations and details, and starting another search.
- Support loading, empty, error, and unavailable-image states in a responsive interface.

## Capabilities

### New Capabilities

- `media-catalog`: Browse catalog entries and view their details.
- `catalog-management`: Create catalog entries with validation and API feedback.
- `local-recommendations`: Match free-text requests to catalog metadata and present explainable recommendations and alternatives.

### Modified Capabilities

None.

## Impact

- React and Vite frontend organized into `src/api`, `src/components`, and `src/pages`.
- Local catalog data exposed over HTTP by JSON Server, with `db.json` as the MVP data source.
- New OpenSpec capability specifications for the catalog, catalog management, and local recommendations.
- Catalog data provenance, reuse permissions, and attribution must be verified before data is included.
