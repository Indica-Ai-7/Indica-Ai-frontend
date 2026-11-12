# Spec Delta

## Purpose

Lets users add valid entries to the shared local catalog and receive truthful feedback about the result.

## ADDED Requirements

### Requirement: Create a catalog entry
The system SHALL let users submit a new catalog entry using the fields defined by the catalog data contract.

#### Scenario: Valid entry is created
- **WHEN** a user submits an entry with valid required fields and the catalog service accepts it
- **THEN** the system confirms creation and the new entry appears in the catalog

#### Scenario: Created entry persists
- **WHEN** a user reloads the application after a successful creation
- **THEN** the new entry remains available from the catalog service

### Requirement: Validate catalog entry fields
The system SHALL identify missing required fields and invalid values before treating an entry as ready to submit.

#### Scenario: Required field is missing
- **WHEN** a user submits an entry without a required field
- **THEN** the system identifies the missing field with an understandable message

#### Scenario: Field value is invalid
- **WHEN** a user submits a value that does not match the catalog data contract
- **THEN** the system identifies the invalid value and does not report the entry as created

### Requirement: Report catalog service failures
The system SHALL confirm creation only after a successful response from the catalog service and SHALL communicate submission failures.

#### Scenario: Catalog service rejects or fails the submission
- **WHEN** the catalog service returns an error or cannot be reached
- **THEN** the system displays an understandable error, does not show a success confirmation, and preserves entered values when possible
