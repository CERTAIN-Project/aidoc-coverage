# Ontology Coverage Dashboard

SvelteKit application for comparing an instantiated ontology against an originating ontology with a project-managed competency-query set executed server-side with Comunica.

## Stack

- SvelteKit + TypeScript
- Flowbite-Svelte + Tailwind CSS
- `@comunica/query-sparql`
- Vitest + Playwright

## Commands

```bash
npm install
npm run check
npm test
npm run test:e2e
npm run build
npm run dev
```

## Environment

- `SPARQL_ENDPOINT_URL` (optional): absolute URL to the SPARQL endpoint that should be queried by Comunica (for example `http://ontop:8080/sparql`)
- If `SPARQL_ENDPOINT_URL` is not set, analysis falls back to the selected bundled example ontology.
- Analysis requests now use JSON rather than form submissions, so Docker deployments do not need a build-time trusted-origins setting for SvelteKit CSRF protection.

## What it does

- Uses a bundled AIdoc-AP originating ontology together with a configured SPARQL endpoint source
- Runs server-side coverage analysis against bundled competency queries
- Shows a traffic-light summary with counts and coverage percentage
- Supports filtering and per-query detail inspection
- Returns actionable validation and query-set error feedback

## Test fixtures

Sample ontology and query fixtures live under `tests/fixtures/`.
