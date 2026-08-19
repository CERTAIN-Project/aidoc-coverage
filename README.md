# Ontology Coverage Dashboard

SvelteKit application for comparing an instantiated ontology against an originating ontology with a project-managed competency-query set executed server-side with Comunica.

## Stack

- SvelteKit + TypeScript
- Flowbite-Svelte + Tailwind CSS
- `@comunica/query-sparql`
- Vitest + Playwright

## Setup - Docker

This repository includes two Docker Compose files:

- `compose.yaml`: standard/runtime setup
- `dev-compose.yaml`: development-oriented setup

Before running either setup, configure your environment file:

```bash
cp env .env
```

Then edit `.env` and set values for your environment.

- `SPARQL_ENDPOINT_URL` (**required**): **URL** to the SPARQL endpoint (e.g. `http://ontop:8080/sparql`) or **empty** for examples
- `PORT` (optional): port to expose the dashboard on (default: `3000`)

Example commands:

```bash
# Run the default setup
docker compose -f compose.yaml up

# Run the development setup
docker compose -f dev-compose.yaml up --build
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
