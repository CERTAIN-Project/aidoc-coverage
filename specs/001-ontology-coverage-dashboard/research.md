# Research: Ontology Coverage Dashboard

## Runtime and Project Shape

### Decision

Use a single SvelteKit application with TypeScript on the Node.js runtime.

### Rationale

SvelteKit provides filesystem routing, first-class server endpoints, and server-only modules that fit a dashboard needing both interactive UI and server-side ontology analysis. TypeScript aligns with the constitution's type-safety gate and keeps analysis/result mapping contracts explicit.

### Alternatives considered

- Plain JavaScript SvelteKit: rejected because the analysis pipeline and response mapping benefit from stronger typing.
- Split frontend/backend projects: rejected because v1 scope is small enough for one SvelteKit app and a split would add unnecessary coordination overhead.

## UI Structure and Rendering

### Decision

Keep the dashboard on `src/routes/+page.svelte`, compose the page from reusable Flowbite-Svelte-based components under `src/lib/components`, and call a dedicated server endpoint for analysis.

### Rationale

This keeps the route tree simple, preserves standard SvelteKit structure, and avoids putting upload, summary, filter, and detail logic into one large component. A server endpoint gives a stable contract for automated testing and future integrations.

### Alternatives considered

- Implement analysis through page form actions only: rejected because a JSON endpoint is easier to contract-test and reuse from enhanced client-side interactions.
- Put all UI in a single page file: rejected because it increases complexity and makes testing harder.

## Ontology and Query Execution

### Decision

Run all Turtle parsing and competency-query evaluation on the server with `@comunica/query-sparql`, using one reusable query engine per process where practical.

### Rationale

Comunica is documented primarily for Node.js-style application use with provided sources. Running analysis server-side avoids browser file-system limitations, keeps RDF processing dependencies out of the client bundle, and supports deterministic handling of uploaded local files.

### Alternatives considered

- Browser-side query execution: rejected because large RDF processing would increase bundle size, complicate file handling, and make performance less predictable.
- Remote analysis service: rejected because the feature request is for local project inputs and there is no need for networked persistence in v1.

## Query Asset Management

### Decision

Treat the competency-query set as a project-managed server asset set and mirror it into a server-only directory in the application so each query has a stable identifier, label, and query text.

### Rationale

The spec requires traceability from UI results back to the originating competency query. Keeping query files local to the app runtime avoids network availability risk and guarantees deterministic analysis for repeated runs with the same inputs.

### Alternatives considered

- Fetch query files directly from GitHub at runtime: rejected because network dependence would hurt determinism and local development.
- Keep query text inline in code: rejected because it becomes hard to maintain and trace as the query set evolves.

## Result Modeling

### Decision

Normalize every query evaluation into a shared result model with explicit statuses `covered`, `partially_covered`, `not_covered`, and `error`, then derive an aggregate summary from that normalized list.

### Rationale

A normalized model makes the traffic-light summary, filtering, detail panels, and repeatability checks all depend on one source of truth. It also separates processing failures from genuine coverage gaps, which the spec calls out explicitly.

### Alternatives considered

- Compute summary values directly in UI code without a shared result model: rejected because it scatters business rules across components.
- Collapse failures into `not_covered`: rejected because users need to distinguish processing issues from true coverage gaps.

## UI, Accessibility, and Design System

### Decision

Use Flowbite-Svelte for semantic UI building blocks such as alerts, badges, cards, tables, and progress/status surfaces, with Tailwind utilities centralized in `src/app.css` and component classes.

### Rationale

Flowbite-Svelte accelerates consistent UI construction while Tailwind provides the design-token layer required by the constitution. Status colors will always be paired with visible text labels so traffic-light styling does not become color-only communication.

### Alternatives considered

- Custom components from scratch: rejected because it adds unnecessary UI surface area for v1.
- Exposing raw Tailwind-only markup throughout routes: rejected because reusable components are easier to test and keep consistent.

## Testing Strategy

### Decision

Adopt a three-layer test strategy: unit tests for loaders/mappers/summarizers, integration and contract tests for the analysis endpoint, and Playwright end-to-end tests for the upload-to-results workflow.

### Rationale

This directly satisfies the constitution's test-first and public-contract requirements. It also keeps RDF-specific logic verifiable independently from the UI while preserving a realistic user-path test for the dashboard experience.

### Alternatives considered

- E2E-only coverage: rejected because failures would be harder to localize.
- Unit-only coverage: rejected because public endpoint behavior and accessibility flows would remain unverified.
