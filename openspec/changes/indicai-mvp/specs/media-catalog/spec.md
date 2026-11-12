# Spec Delta

## Purpose

Lets users browse a varied local catalog and inspect the information needed to decide what to watch.

## ADDED Requirements

### Requirement: Browse catalog entries
The system SHALL let users retrieve catalog entries for films, series, documentaries, animation, and telenovelas through the application's HTTP interface.

#### Scenario: Catalog contains entries
- **WHEN** a user opens the catalog
- **THEN** the system displays entries returned by the catalog HTTP service

#### Scenario: Catalog is empty
- **WHEN** the catalog service returns no entries
- **THEN** the system displays an empty-state message and a useful next step

#### Scenario: Catalog service is unavailable
- **WHEN** the catalog service fails to return the entries
- **THEN** the system displays an error and does not present the failure as an empty or successful result

### Requirement: View catalog entry details
The system SHALL let users open an entry and view its available title, type, genre, year, description, rating, and image information.

#### Scenario: Entry details are available
- **WHEN** a user opens an entry from the catalog
- **THEN** the system displays details belonging to that entry

#### Scenario: Entry image is unavailable
- **WHEN** an entry has no usable image
- **THEN** the system displays a local visual fallback without hiding the entry details

#### Scenario: Requested entry cannot be loaded
- **WHEN** the catalog service cannot return the requested entry
- **THEN** the system displays an error state instead of unrelated or fabricated details

### Requirement: Maintain a verifiable initial catalog
The initial catalog SHALL contain at least 200 distinct entries for each of the five supported types, use stable unique identifiers, and document data sources, reuse permissions, and required attribution.

#### Scenario: Catalog meets the initial quantity and provenance criteria
- **WHEN** the initial catalog is reviewed for release
- **THEN** each supported type has at least 200 distinct entries with stable identifiers and documented sources and reuse permissions

#### Scenario: Quantity or reuse permission cannot be verified
- **WHEN** the initial catalog cannot meet the quantity target with data that may be reused
- **THEN** the shortfall is recorded as a blocker and entries are not invented or used without permission
