# Implementation Plan: Ontology Coverage Dashboard

**Branch**: `001-ontology-coverage-dashboard` | **Date**: 2026-04-20 | **Spec**: [`specs/001-ontology-coverage-dashboard/spec.md`](./spec.md)  
**Input**: Feature specification from `/specs/001-ontology-coverage-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a SvelteKit web application that accepts an originating ontology and an instantiated ontology in Turtle format, evaluates coverage against a project-maintained competency-query set using server-side Comunica execution, and displays an accessible traffic-light-style summary with detailed drill-down results for uncovered or partially covered areas.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS  
**Primary Dependencies**: SvelteKit, Svelte, Flowbite-Svelte, Tailwind CSS, `@comunica/query-sparql`, Vitest, Testing Library, Playwright  
**Storage**: No persistent database in v1; request-scoped uploaded files plus repository-managed query assets  
**Testing**: Vitest for unit/component tests, Playwright for end-to-end flows, contract tests against the analysis endpoint  
**Target Platform**: Node-hosted web application for modern desktop browsers  
**Project Type**: SvelteKit web application  
**Performance Goals**: Initial coverage summary returned within 2 minutes for a standard dataset; UI becomes interactive within 3 seconds on a mid-range device; post-load filtering responds within 200 ms p95  
**Constraints**: Follow standard SvelteKit folder structure; use Flowbite-Svelte and Tailwind for UI; execute ontology parsing and query evaluation on the server; keep results deterministic for identical inputs; explicitly handle loading, empty, and error states; meet WCAG 2.1 AA expectations for UI surfaces  
**Scale/Scope**: Single source ontology plus single instantiated ontology per run; one project-managed competency-query set per deployment; no historical persistence or multi-run comparison in v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate Review

- **Code Quality**: Pass. Plan separates UI, server-only coverage analysis, and query-asset handling into focused modules under `src/lib` to avoid oversized route files and reduce cyclomatic complexity.
- **Test-First**: Pass. Implementation will begin with failing unit tests for result aggregation and status mapping, contract tests for the analysis endpoint, and Playwright coverage-flow tests before feature code.
- **User Experience Consistency**: Pass. The design uses Flowbite-Svelte components, requires actionable validation/error states, and includes explicit loading, empty, and failure handling for all user-visible flows.
- **Performance Requirements**: Pass with monitoring. Server-side query execution keeps RDF processing out of the client bundle, and benchmark coverage will focus on analysis latency and post-analysis filtering responsiveness.

### Post-Design Re-Check

- **Code Quality**: Pass. `research.md`, `data-model.md`, and the server/API contract define clear module boundaries that keep parsing, query execution, mapping, and presentation separate.
- **Test-First**: Pass. `quickstart.md` and `contracts/coverage-analysis.openapi.yaml` establish concrete behaviors for unit, integration, contract, and e2e tests before coding.
- **User Experience Consistency**: Pass. The design includes semantic status colors plus text labels, explicit empty/error states, and accessible upload/result views aligned with the constitution.
- **Performance Requirements**: Pass. The design chooses one server-side analysis request per run, reusable query-engine setup, and repo-local query assets to avoid avoidable network overhead.

## Project Structure

### Documentation (this feature)

```text
specs/001-ontology-coverage-dashboard/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── coverage-analysis.openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app.css
├── app.d.ts
├── lib/
│   ├── components/
│   │   ├── coverage/
│   │   ├── upload/
│   │   └── feedback/
│   ├── schemas/
│   └── server/
│       └── coverage/
│           ├── engine.ts
│           ├── loaders.ts
│           ├── query-set/
│           ├── summarizer.ts
│           ├── mapper.ts
│           └── types.ts
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── api/
│       └── coverage/
│           └── +server.ts
└── hooks.server.ts

tests/
├── unit/
│   ├── lib/server/coverage/
│   └── lib/components/
├── integration/
│   └── api/
└── e2e/
    └── coverage-dashboard.spec.ts
```

**Structure Decision**: Use a single SvelteKit application with the user-facing dashboard in `src/routes`, reusable Flowbite-Svelte-based UI in `src/lib/components`, and all ontology/query logic confined to `src/lib/server/coverage` so local Turtle parsing and Comunica execution remain server-only and testable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
