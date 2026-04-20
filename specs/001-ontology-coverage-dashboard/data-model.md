# Data Model: Ontology Coverage Dashboard

## Overview

The feature evaluates one instantiated ontology against one originating ontology and a project-managed competency-query set. The domain model is request-scoped in v1 and does not require persistent storage.

## Entities

### OntologyInput

Represents one uploaded ontology file used during an analysis run.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `role` | enum | Distinguishes `originating` from `instantiated` input | Required; must be one of the supported roles |
| `filename` | string | Original uploaded filename | Required; non-empty |
| `mediaType` | string | Uploaded content type if provided by the client | Optional; if present must be compatible with Turtle input |
| `content` | string | Raw Turtle content used for parsing/querying | Required; must be readable text |
| `sizeBytes` | number | File size in bytes | Required; must be greater than zero |
| `checksum` | string | Derived digest used for repeatability/debugging | Required after validation |

### QueryDefinition

Represents one competency-query asset available to the application.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | string | Stable query identifier used in API/UI traceability | Required; unique |
| `title` | string | Human-readable label for the query | Required |
| `description` | string | Summary of what the query checks | Optional |
| `queryText` | string | Query source used during evaluation | Required; non-empty |
| `sourcePath` | string | Project-relative asset location | Required |
| `group` | string | Optional grouping/category label | Optional |

### QueryEvaluation

Represents the evaluation outcome of one `QueryDefinition` for a given input pair.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `queryId` | string | Reference to the evaluated query definition | Required; must map to an existing `QueryDefinition` |
| `status` | enum | `covered`, `partially_covered`, `not_covered`, or `error` | Required |
| `explanation` | string | Plain-language reason shown to users | Required |
| `evidenceCount` | number | Number of matches or derived evidence items | Required; zero or greater |
| `evidencePreview` | array | Optional sample values shown in detail view | Optional |
| `errorCode` | string | Structured failure reason when `status = error` | Optional |

### CoverageSummary

Aggregated totals derived from the query evaluations in one run.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `totalQueries` | number | Total number of attempted evaluations | Required; greater than zero |
| `coveredCount` | number | Number of fully covered results | Required; zero or greater |
| `partialCount` | number | Number of partially covered results | Required; zero or greater |
| `notCoveredCount` | number | Number of uncovered results | Required; zero or greater |
| `errorCount` | number | Number of evaluation failures | Required; zero or greater |
| `coveragePercent` | number | Percentage of non-error queries that are fully covered | Required; 0-100 |
| `overallStatus` | enum | Dashboard status derived from totals | Required; one of the supported traffic-light states |

### CoverageRun

Represents one end-to-end analysis request and its lifecycle.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `runId` | string | Correlation identifier for logs and responses | Required; unique per request |
| `originatingOntology` | OntologyInput | Validated source ontology input | Required |
| `instantiatedOntology` | OntologyInput | Validated instantiated ontology input | Required |
| `querySetVersion` | string | Version or digest of the loaded query asset set | Required |
| `summary` | CoverageSummary | Aggregate result for the run | Required on completion |
| `results` | QueryEvaluation[] | Normalized per-query outcomes | Required on completion |
| `startedAt` | datetime | Analysis start timestamp | Required |
| `completedAt` | datetime | Analysis end timestamp | Optional until completion |

## Relationships

- One `CoverageRun` contains exactly two `OntologyInput` records with distinct roles.
- One `CoverageRun` evaluates many `QueryDefinition` records.
- Each `QueryDefinition` produces at most one `QueryEvaluation` per `CoverageRun`.
- One `CoverageRun` produces one derived `CoverageSummary`.

## Validation Rules

- Both ontology inputs must be present before analysis starts.
- Inputs must parse as readable Turtle before any competency query is executed.
- Query definitions must load successfully before an analysis can proceed.
- Summary totals must equal the count of query evaluations produced for the run.
- `overallStatus` must be derived from summary totals by one centralized rule set.
- Any evaluation failure must remain visible as `error` and may not be silently converted to `not_covered`.

## State Transitions

### CoverageRun

```text
received
  -> validating_inputs
  -> loading_query_set
  -> running_queries
  -> summarizing
  -> completed

received
  -> validating_inputs
  -> failed

loading_query_set
  -> failed

running_queries
  -> failed
```

### QueryEvaluation

```text
pending
  -> covered
  -> partially_covered
  -> not_covered
  -> error
```
