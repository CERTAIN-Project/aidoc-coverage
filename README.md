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

## What it does

- Uploads one originating ontology and one instantiated ontology in Turtle format
- Runs server-side coverage analysis against bundled competency queries
- Shows a traffic-light summary with counts and coverage percentage
- Supports filtering and per-query detail inspection
- Returns actionable validation and query-set error feedback

## Test fixtures

Sample ontology and query fixtures live under `tests/fixtures/`.
