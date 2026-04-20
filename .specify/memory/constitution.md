<!--
  SYNC IMPACT REPORT
  Version change: (template) → 1.0.0
  Added sections: Core Principles (I–IV), Quality Gates, Development Workflow, Governance
  Removed sections: N/A (initial population)
  Templates updated:
    ✅ .specify/templates/plan-template.md — Constitution Check gates align with principles
    ✅ .specify/templates/spec-template.md — Success Criteria and Requirements reference principles
    ✅ .specify/templates/tasks-template.md — Polish phase references performance + quality tasks
  Follow-up TODOs: None — all placeholders resolved.
-->

# Coverage Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

Every line of code committed to this project MUST meet the following standards:

- Code MUST be readable and self-documenting; complex logic MUST include inline comments
  explaining *why*, not *what*.
- Functions and modules MUST follow the Single Responsibility Principle; a unit that does more
  than one thing MUST be decomposed.
- Code MUST pass all configured linters and static analysis checks before merging; no lint
  suppressions are permitted without a documented justification in the PR.
- Cyclomatic complexity per function MUST NOT exceed 10; refactoring is required if it does.
- Dead code, commented-out blocks, and TODO stubs MUST NOT be merged; open issues replace
  in-code TODOs.

**Rationale**: Low-defect, maintainable code reduces long-term cost and onboarding friction.
Quality standards are enforced at the tooling level so they are objective and consistent.

### II. Test-First (NON-NEGOTIABLE)

All features and bug fixes MUST follow the Red-Green-Refactor cycle:

- Tests MUST be written and confirmed failing *before* any implementation code is authored.
- Unit test coverage for new code MUST be ≥ 80 %; coverage regressions MUST NOT be merged.
- Integration tests MUST cover every public contract (API endpoint, CLI command, exported
  function) introduced or modified by a feature.
- Tests MUST be deterministic; flaky tests MUST be fixed or deleted before merging.
- Test names MUST describe the behaviour being verified using the pattern
  `<unit>_<scenario>_<expected>` or equivalent BDD given/when/then naming.

**Rationale**: Test-first development ensures behaviour is specified before implementation,
reduces regression risk, and makes refactoring safe.

### III. User Experience Consistency

All user-facing surfaces (UI, CLI, API responses) MUST adhere to consistent design contracts:

- Error messages MUST be actionable: they MUST state what went wrong and how the user can
  recover, using plain language.
- API and CLI responses MUST follow a single, documented schema; breaking changes to these
  schemas MUST be versioned and communicated in release notes.
- Loading states, empty states, and error states MUST be handled explicitly in every user
  interaction flow; silent failures are prohibited.
- Visual components and interaction patterns MUST reuse the established design system tokens
  (spacing, colour, typography); ad-hoc overrides require design-team approval.
- Accessibility (WCAG 2.1 AA) MUST be validated for all UI surfaces before release.

**Rationale**: Consistency builds user trust and reduces support burden. Explicit handling of
edge states prevents silent data loss and user confusion.

### IV. Performance Requirements

Features MUST meet defined performance budgets before merging to the main branch:

- API endpoints and CLI commands MUST complete within **200 ms p95** under expected load;
  any operation exceeding this limit MUST include a written justification and a tracked
  optimisation ticket.
- Frontend/UI time-to-interactive MUST remain below **3 s** on a mid-range device on a
  standard broadband connection.
- No dependency may be introduced that increases the production bundle size by more than
  **50 KB (gzipped)** without architectural review.
- Performance-critical paths MUST include benchmark tests that run in CI; regressions
  exceeding 10 % MUST block the merge.
- Database queries MUST be analysed with EXPLAIN/EXPLAIN ANALYZE before merging; N+1 query
  patterns are prohibited.

**Rationale**: Performance is a feature. Establishing measurable budgets prevents incremental
degradation and ensures a consistent experience across all users.

## Quality Gates

Every pull request MUST pass the following automated gates before merging:

- **Lint**: Zero lint errors; warnings reviewed case-by-case.
- **Type Safety**: No new type errors; strict mode enabled for typed languages.
- **Unit Tests**: All tests pass; coverage MUST NOT regress below the project threshold.
- **Integration Tests**: Full contract suite passes.
- **Performance Benchmarks**: No regressions exceeding 10 % on tracked benchmarks.
- **Security Scan**: No new high/critical CVEs introduced by dependency changes.
- **Accessibility Audit** (UI changes only): WCAG 2.1 AA automated checks pass.

Manual reviewer sign-off is required in addition to automated gates for:

- Changes to public API contracts or CLI command signatures.
- Introduction of new external dependencies.
- Any constitution amendment.

## Development Workflow

The following workflow governs all feature development:

1. **Specify** — Write or update the feature spec (`spec.md`) with user stories and acceptance
   criteria before writing any code.
2. **Plan** — Produce an implementation plan (`plan.md`) that identifies technical approach,
   dependencies, and complexity trade-offs.
3. **Test** — Write failing tests that encode the acceptance criteria.
4. **Implement** — Write the minimum code to make tests pass.
5. **Refactor** — Improve code quality without changing behaviour; verify tests still pass.
6. **Review** — Open a PR; automated gates must be green; at least one peer reviewer must
   approve before merge.
7. **Document** — Update relevant documentation (API docs, README, quickstart) in the same PR.

Skipping or reordering steps MUST be justified in writing in the PR description.

## Governance

This constitution supersedes all other project practices and documentation where conflicts
arise. The following rules govern amendments:

- Any team member may propose an amendment by opening a PR that modifies this file with a
  clear rationale and an updated version number.
- Amendments MUST be approved by at least two project maintainers.
- MAJOR version bumps (removing or fundamentally redefining principles) require a team-wide
  discussion and documented migration plan.
- MINOR version bumps (new principle or materially expanded guidance) require maintainer
  approval and a note in the release changelog.
- PATCH version bumps (clarifications, wording) require one maintainer approval.
- All PRs and code reviews MUST verify compliance with the principles above. Non-compliant
  code MUST NOT be merged even if all automated gates pass.
- Complexity exceptions (e.g., exceeding cyclomatic complexity limit) MUST be documented in
  the plan's Complexity Tracking table with justification.
- Runtime development guidance is maintained in `.github/copilot-instructions.md`.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
