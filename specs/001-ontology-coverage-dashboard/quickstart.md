# Quickstart: Ontology Coverage Dashboard

## Prerequisites

- Node.js 20 LTS
- npm
- The competency-query set available in the application's server-side query asset directory
- One originating ontology file in Turtle format
- One instantiated ontology file in Turtle format

## Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Run type and test validation before starting the UI.

   ```bash
   npm run check
   npm test
   ```

3. Start the SvelteKit development server.

   ```bash
   npm run dev
   ```

4. Open the local application URL reported by the dev server.

## First Run

1. Open the coverage dashboard page.
2. Upload the originating ontology Turtle file.
3. Upload the instantiated ontology Turtle file.
4. Start the coverage analysis.
5. Confirm the application shows:
   - an overall traffic-light-style status,
   - counts and percentages by status,
   - a list of detailed per-query results,
   - actionable feedback for any invalid input or evaluation failures.

## Test Workflow

1. Run unit and integration tests.

   ```bash
   npm run test
   ```

2. Run end-to-end coverage flow tests.

   ```bash
   npm run test:e2e
   ```

3. Create a production build.

   ```bash
   npm run build
   ```

## Expected Developer Outputs

- Server-side analysis endpoint returns a normalized coverage payload for identical inputs.
- UI renders loading, empty, success, and error states explicitly.
- Non-green results can be filtered to focus remediation work.
