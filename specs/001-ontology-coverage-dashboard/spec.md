# Feature Specification: Ontology Coverage Dashboard

**Feature Branch**: `001-ontology-coverage-dashboard`  
**Created**: 2026-04-20  
**Status**: Draft  
**Input**: User description: "Create a web application that show current coverage using visual representation like e.g. a traffic light color system. The inputs are an onotology (turtel) and an instantiated ontology (also turtle; it is an application of the ontology). We want to display the coverage from the instantiated application of the originating ontology. To check the coverage we use sparql queries, which are already in this folder in a github repo (https://github.com/CERTAIN-Project/aidoc-ap/tree/main/sparql_competency_questions)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a coverage overview (Priority: P1)

As an ontology analyst, I want to provide an originating ontology and an instantiated ontology so that I can immediately see how much of the intended model is covered by the instantiated application.

**Why this priority**: This is the core value of the feature. Without a trustworthy coverage overview, the application does not meet its purpose.

**Independent Test**: Can be fully tested by submitting one source ontology, one instantiated ontology, and an available competency-query set, then confirming the application returns an overall coverage summary with visual status indicators and counts.

**Acceptance Scenarios**:

1. **Given** a valid source ontology, a valid instantiated ontology, and an available competency-query set, **When** the user starts a coverage run, **Then** the system shows an overall coverage summary with covered, partially covered, and not covered states.
2. **Given** a completed coverage run, **When** the user opens the overview page, **Then** the system presents the current coverage using a traffic-light-style visual representation and supporting counts or percentages.

---

### User Story 2 - Inspect uncovered and partial areas (Priority: P2)

As an ontology analyst, I want to inspect detailed results behind the overall coverage status so that I can identify which competency questions or ontology areas are not sufficiently represented.

**Why this priority**: Users need actionable detail, not just a headline score, in order to improve the instantiated ontology.

**Independent Test**: Can be fully tested by running coverage analysis and selecting one non-green result to confirm the user can see the affected competency query or ontology area and its current status.

**Acceptance Scenarios**:

1. **Given** a coverage run with mixed results, **When** the user filters for partially covered or not covered items, **Then** the system lists only the matching results with enough context to identify the gap.
2. **Given** a specific coverage result, **When** the user views its details, **Then** the system shows the related competency question or query identifier, its status, and a plain-language explanation of the result.

---

### User Story 3 - Recover from invalid or incomplete inputs (Priority: P3)

As an ontology analyst, I want clear feedback when the ontologies or query set cannot be processed so that I can correct the problem and rerun the analysis without guessing what failed.

**Why this priority**: Coverage results are only useful if users can trust the inputs and quickly resolve errors.

**Independent Test**: Can be fully tested by submitting an invalid Turtle file or running without an available query set and confirming the application blocks the run and explains what must be fixed.

**Acceptance Scenarios**:

1. **Given** an invalid or unreadable ontology file, **When** the user starts a coverage run, **Then** the system does not produce misleading coverage results and instead explains the input problem.
2. **Given** a missing or unusable competency-query set, **When** the user attempts a coverage run, **Then** the system reports that coverage cannot be evaluated until the query set is available.

### Edge Cases

- What happens when the instantiated ontology uses terms that do not appear in the originating ontology?
- How does the system handle competency queries that cannot be evaluated successfully for a given input pair?
- What happens when one ontology parses correctly but the other is empty or contains no relevant assertions?
- How does the system present results when every competency query is uncovered or when every competency query is covered?
- What happens when the available competency-query set does not match the ontology version being analyzed?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a user to provide one originating ontology in Turtle format and one instantiated ontology in Turtle format for a single coverage analysis run.
- **FR-002**: The system MUST validate that both supplied files are readable Turtle documents before running coverage analysis.
- **FR-003**: The system MUST evaluate coverage using the project-defined competency-query set associated with the originating ontology.
- **FR-004**: The system MUST determine a coverage status for each evaluated competency query using at least the states covered, partially covered, and not covered.
- **FR-005**: The system MUST present the overall coverage result using an immediately understandable visual status representation, such as a traffic-light color scheme.
- **FR-006**: The system MUST display supporting summary metrics for the overall result, including counts and percentages by coverage status.
- **FR-007**: The system MUST allow users to inspect detailed results for individual competency queries or equivalent coverage checks.
- **FR-008**: The system MUST let users filter or narrow detailed results by coverage status.
- **FR-009**: The system MUST show a clear explanation when coverage cannot be calculated because of invalid inputs, missing query assets, or query-evaluation failures.
- **FR-010**: The system MUST maintain traceability between each displayed coverage result and the competency query or ontology element it represents.
- **FR-011**: The system MUST ensure repeated analyses with the same ontology inputs and query set produce the same coverage statuses and summary totals.

### Key Entities *(include if feature involves data)*

- **Originating Ontology**: The reference ontology that defines the intended concepts, relationships, and competency checks for coverage evaluation.
- **Instantiated Ontology**: The applied ontology content being assessed against the originating ontology for current coverage.
- **Competency Query**: A predefined coverage check representing a question, rule, or expectation that should be satisfied by the instantiated ontology.
- **Coverage Result**: The outcome of evaluating a single competency query, including status, explanation, and traceability metadata.
- **Coverage Summary**: The aggregated view of all coverage results, including visual status, counts, and percentages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can submit both ontology files and receive an initial visual coverage summary within 2 minutes for a standard project dataset.
- **SC-002**: 100% of available competency queries in a run are assigned a displayed outcome of covered, partially covered, not covered, or actionable error.
- **SC-003**: At least 90% of users can identify one uncovered or partially covered area without assistance during first-time use.
- **SC-004**: Re-running the same analysis inputs with the same query set produces identical summary totals and per-query statuses in 100% of tested cases.
- **SC-005**: Users can isolate non-green results to a reduced detail view in no more than 3 interaction steps.

## Assumptions

- Primary users are ontology analysts, model maintainers, or project stakeholders who need to assess how fully an instantiated ontology reflects its source ontology.
- The initial release evaluates one source ontology and one instantiated ontology at a time.
- Both ontologies are supplied as Turtle documents by the user at analysis time.
- The project-maintained competency-query set remains the authoritative basis for coverage evaluation and is made available to the application as part of the project environment.
- The first release focuses on current-state coverage visibility and gap identification, not on historical trend tracking or multi-run comparison.
- Parsing or query-evaluation failures are shown separately from genuine uncovered results so users can distinguish data gaps from processing problems.
