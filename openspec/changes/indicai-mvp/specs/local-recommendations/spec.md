# Spec Delta

## Purpose

Lets users describe what they want to watch and receive consistent, explainable suggestions based on the local catalog.

## ADDED Requirements

### Requirement: Interpret a free-text request locally
The system SHALL use criteria found in the user's request and catalog metadata to find relevant entries without requiring an external AI service.

#### Scenario: Request contains recognizable criteria
- **WHEN** a user submits a non-empty request containing criteria represented in catalog metadata
- **THEN** the system uses those criteria to find candidate entries in the catalog

#### Scenario: Request is empty
- **WHEN** a user submits an empty or whitespace-only request
- **THEN** the system asks the user to enter a preference and does not present recommendations

### Requirement: Present ranked and explainable recommendations
The system SHALL order matching entries consistently for the same catalog and request and SHALL explain the criteria that contributed to each recommendation.

#### Scenario: Matching entries are found
- **WHEN** a request matches one or more catalog entries
- **THEN** the system presents the entries in a consistent order with a brief explanation of their matching criteria

#### Scenario: Same request is repeated against unchanged data
- **WHEN** the same request is submitted again while catalog metadata is unchanged
- **THEN** the system returns recommendations in the same order

### Requirement: Offer alternatives when there is no exact match
The system SHALL distinguish entries that match the request from alternatives and SHALL clearly communicate when no exact match is found.

#### Scenario: No exact match but related entries exist
- **WHEN** no entry meets the exact request criteria but related entries exist
- **THEN** the system labels them as alternatives and explains that there was no exact match

#### Scenario: No related entries exist
- **WHEN** no exact match or useful alternative can be found
- **THEN** the system displays a no-results message and gives the user a clear next step

### Requirement: Continue the recommendation conversation
The system SHALL let users review recommended entry details and start another request from the recommendation experience.

#### Scenario: User opens a recommended entry
- **WHEN** a user selects a recommendation
- **THEN** the system shows the selected entry's catalog details

#### Scenario: User starts another request
- **WHEN** a user chooses to search again
- **THEN** the system lets the user submit a new request without presenting stale recommendations as the new result
