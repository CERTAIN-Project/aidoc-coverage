# Tasks: Ontology Coverage Dashboard

**Input**: Design documents from `/specs/001-ontology-coverage-dashboard/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/coverage-analysis.openapi.yaml`, `quickstart.md`

**Tests**: Included. The plan and constitution require test-first delivery, contract coverage, unit coverage, and end-to-end validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the SvelteKit workspace, core tooling, and shared styling baseline.

- [X] T001 Initialize the SvelteKit package, scripts, and dependencies in `/home/tdam/fh/projects/CERTAIN/coverage/package.json`
- [X] T002 Create SvelteKit, Vite, and TypeScript project configuration in `/home/tdam/fh/projects/CERTAIN/coverage/svelte.config.js`, `/home/tdam/fh/projects/CERTAIN/coverage/vite.config.ts`, and `/home/tdam/fh/projects/CERTAIN/coverage/tsconfig.json`
- [X] T003 [P] Configure Tailwind and global application styles in `/home/tdam/fh/projects/CERTAIN/coverage/src/app.css` and `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/+layout.svelte`
- [X] T004 [P] Configure Vitest, Playwright, and shared test setup in `/home/tdam/fh/projects/CERTAIN/coverage/vitest.config.ts`, `/home/tdam/fh/projects/CERTAIN/coverage/playwright.config.ts`, and `/home/tdam/fh/projects/CERTAIN/coverage/tests/setup.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared coverage-analysis core that all user stories depend on.

**⚠️ CRITICAL**: No user story work should be completed before this phase is in place.

- [X] T005 Create request and domain type definitions for ontology inputs, coverage results, and summaries in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/types.ts`
- [X] T006 [P] Implement upload and analysis validation schemas in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/schemas/coverage.ts`
- [X] T007 [P] Create the query-set manifest and asset loader in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/query-set/manifest.ts` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/query-set/index.ts`
- [X] T008 [P] Add ontology and query fixtures for deterministic tests in `/home/tdam/fh/projects/CERTAIN/coverage/tests/fixtures/ontologies/originating.ttl`, `/home/tdam/fh/projects/CERTAIN/coverage/tests/fixtures/ontologies/instantiated.ttl`, and `/home/tdam/fh/projects/CERTAIN/coverage/tests/fixtures/queries/sample.rq`
- [X] T009 Implement Turtle loading, parsing preparation, and checksum helpers in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/loaders.ts`
- [X] T010 Implement normalized result mapping and overall status summarization in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/mapper.ts` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/summarizer.ts`
- [X] T011 Create reusable status and feedback UI primitives in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/coverage/CoverageBadge.svelte` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/feedback/StatusAlert.svelte`

**Checkpoint**: Foundation ready - coverage analysis and UI stories can now build on stable types, validation, fixtures, and query assets.

---

## Phase 3: User Story 1 - Generate a coverage overview (Priority: P1) 🎯 MVP

**Goal**: Let users upload two Turtle ontologies, run coverage analysis, and see an overall traffic-light-style summary with counts and percentages.

**Independent Test**: Submit one valid originating ontology and one valid instantiated ontology, then confirm the dashboard returns a completed coverage summary with covered, partially covered, and not covered states plus supporting totals.

### Tests for User Story 1 ⚠️

> **NOTE**: Write these tests first, verify they fail, then implement the story.

- [X] T012 [P] [US1] Add the `POST /api/coverage` contract test in `/home/tdam/fh/projects/CERTAIN/coverage/tests/integration/api/coverage.contract.test.ts`
- [X] T013 [P] [US1] Add unit tests for ontology loading and summary derivation in `/home/tdam/fh/projects/CERTAIN/coverage/tests/unit/lib/server/coverage/loaders.test.ts` and `/home/tdam/fh/projects/CERTAIN/coverage/tests/unit/lib/server/coverage/summarizer.test.ts`
- [X] T014 [P] [US1] Add the happy-path upload-to-summary browser flow in `/home/tdam/fh/projects/CERTAIN/coverage/tests/e2e/coverage-dashboard.spec.ts`

### Implementation for User Story 1

- [X] T015 [US1] Implement the Comunica query engine and per-query execution pipeline in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/engine.ts`
- [X] T016 [US1] Implement the coverage analysis API endpoint in `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/api/coverage/+server.ts`
- [X] T017 [P] [US1] Build the dual-file ontology upload form in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/upload/OntologyUploadForm.svelte`
- [X] T018 [P] [US1] Build the traffic-light summary cards and aggregate metrics display in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/coverage/CoverageSummary.svelte`
- [X] T019 [US1] Compose the upload, submit, and summary dashboard flow in `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/+page.svelte`

**Checkpoint**: User Story 1 is independently functional when users can upload valid inputs and receive a summary result without using any detail or recovery features from later stories.

---

## Phase 4: User Story 2 - Inspect uncovered and partial areas (Priority: P2)

**Goal**: Let users filter results and inspect per-query details for uncovered and partially covered coverage checks.

**Independent Test**: Run a coverage analysis that produces mixed statuses, filter to non-green results, and open a detail view that shows the related query identifier, status, and explanation.

### Tests for User Story 2 ⚠️

- [X] T020 [P] [US2] Add the filtered-results integration test in `/home/tdam/fh/projects/CERTAIN/coverage/tests/integration/api/coverage-results.test.ts`
- [X] T021 [P] [US2] Add component tests for filter and detail interactions in `/home/tdam/fh/projects/CERTAIN/coverage/tests/unit/lib/components/coverage/ResultsFilterBar.test.ts` and `/home/tdam/fh/projects/CERTAIN/coverage/tests/unit/lib/components/coverage/ResultDetailPanel.test.ts`

### Implementation for User Story 2

- [X] T022 [P] [US2] Build the status filter bar for result narrowing in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/coverage/ResultsFilterBar.svelte`
- [X] T023 [P] [US2] Build the results table and detail panel in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/coverage/ResultsTable.svelte` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/coverage/ResultDetailPanel.svelte`
- [X] T024 [US2] Integrate result filtering and drill-down state into `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/+page.svelte`

**Checkpoint**: User Story 2 is independently functional when a completed run can be explored, filtered, and inspected without changing the analysis behavior from User Story 1.

---

## Phase 5: User Story 3 - Recover from invalid or incomplete inputs (Priority: P3)

**Goal**: Show actionable validation, missing-query, and execution-failure feedback so users can correct problems and rerun analysis confidently.

**Independent Test**: Attempt analysis with an invalid Turtle file and with a missing or unusable query set, then confirm the UI blocks misleading results and shows actionable recovery guidance.

### Tests for User Story 3 ⚠️

- [X] T025 [P] [US3] Add invalid-input and missing-query integration tests in `/home/tdam/fh/projects/CERTAIN/coverage/tests/integration/api/coverage-errors.test.ts`
- [X] T026 [P] [US3] Add browser recovery-flow coverage for invalid uploads in `/home/tdam/fh/projects/CERTAIN/coverage/tests/e2e/coverage-errors.spec.ts`

### Implementation for User Story 3

- [X] T027 [US3] Implement actionable API error mapping and failure classification in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/server/coverage/errors.ts` and `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/api/coverage/+server.ts`
- [X] T028 [P] [US3] Build explicit loading, empty, and error state components in `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/feedback/LoadingState.svelte` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/feedback/ErrorState.svelte`
- [X] T029 [US3] Wire validation, missing-query, and execution failure feedback into `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/+page.svelte` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/upload/OntologyUploadForm.svelte`

**Checkpoint**: User Story 3 is independently functional when failure cases are clearly explained and users can retry analysis without stale or misleading results.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, performance safeguards, and accessibility refinements that apply across stories.

- [X] T030 [P] Add setup and usage documentation in `/home/tdam/fh/projects/CERTAIN/coverage/README.md` and `/home/tdam/fh/projects/CERTAIN/coverage/specs/001-ontology-coverage-dashboard/quickstart.md`
- [X] T031 [P] Add an analysis latency regression test in `/home/tdam/fh/projects/CERTAIN/coverage/tests/integration/api/coverage.performance.test.ts`
- [X] T032 [P] Refine keyboard accessibility, ARIA labeling, and focus handling in `/home/tdam/fh/projects/CERTAIN/coverage/src/routes/+page.svelte` and `/home/tdam/fh/projects/CERTAIN/coverage/src/lib/components/coverage/ResultDetailPanel.svelte`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies - can start immediately
- **Phase 2: Foundational**: Depends on Phase 1 - blocks all story completion
- **Phase 3: User Story 1**: Depends on Phase 2 - delivers the MVP coverage flow
- **Phase 4: User Story 2**: Depends on Phase 3 response shape and rendered summary state
- **Phase 5: User Story 3**: Depends on Phase 3 upload and analysis flow, then adds recovery handling
- **Phase 6: Polish**: Depends on the stories selected for delivery

### User Story Dependencies

- **US1**: No dependency on other user stories after Foundational phase completion
- **US2**: Depends on the normalized coverage payload from US1 but remains independently testable once that payload exists
- **US3**: Depends on the upload and analysis entry points from US1 but remains independently testable through failure scenarios

### Within Each User Story

- Tests MUST be written and fail before implementation
- Server-side analysis logic must land before the route or UI consumes it
- Reusable UI components should land before page-level composition
- Each story should be validated independently at its checkpoint before moving on

### Suggested Completion Order

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1 (MVP)
4. Phase 4: User Story 2
5. Phase 5: User Story 3
6. Phase 6: Polish

---

## Parallel Example: User Story 1

```text
- T012 [US1] Contract test in tests/integration/api/coverage.contract.test.ts
- T013 [US1] Unit tests in tests/unit/lib/server/coverage/loaders.test.ts and tests/unit/lib/server/coverage/summarizer.test.ts
- T014 [US1] E2E test in tests/e2e/coverage-dashboard.spec.ts

- T017 [US1] Upload form in src/lib/components/upload/OntologyUploadForm.svelte
- T018 [US1] Summary cards in src/lib/components/coverage/CoverageSummary.svelte
```

## Parallel Example: User Story 2

```text
- T020 [US2] Integration test in tests/integration/api/coverage-results.test.ts
- T021 [US2] Component tests in tests/unit/lib/components/coverage/ResultsFilterBar.test.ts and tests/unit/lib/components/coverage/ResultDetailPanel.test.ts

- T022 [US2] Filter bar in src/lib/components/coverage/ResultsFilterBar.svelte
- T023 [US2] Results table and detail panel in src/lib/components/coverage/ResultsTable.svelte and src/lib/components/coverage/ResultDetailPanel.svelte
```

## Parallel Example: User Story 3

```text
- T025 [US3] Integration tests in tests/integration/api/coverage-errors.test.ts
- T026 [US3] E2E recovery test in tests/e2e/coverage-errors.spec.ts

- T028 [US3] Feedback state components in src/lib/components/feedback/LoadingState.svelte and src/lib/components/feedback/ErrorState.svelte
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the upload-to-summary flow independently before adding detail or error-recovery features

### Incremental Delivery

1. Deliver Setup + Foundational to establish the SvelteKit/Comunica baseline
2. Deliver US1 as the first usable increment
3. Deliver US2 to make coverage gaps explorable
4. Deliver US3 to harden validation and recovery behavior
5. Finish with polish, performance, and accessibility refinement

### Parallel Team Strategy

1. One developer can finish Setup while another prepares shared test fixtures
2. Once Foundational work is complete, UI-heavy tasks and server-heavy tasks inside each story can run in parallel
3. If multiple developers are available after US1 is stable, one can focus on US2 detail views while another focuses on US3 recovery states

---

## Notes

- All tasks follow the required checklist format with task ID, optional `[P]`, optional story label, and explicit file paths
- `[P]` tasks touch separate files and can be split across contributors
- User stories remain independently testable at each checkpoint
- MVP scope is Phase 3 / User Story 1 only
