import type { QueryDefinition, QueryEvaluation, RawQueryOutcome } from './types';

function buildExplanation(query: QueryDefinition, status: RawQueryOutcome['status'], evidenceCount: number) {
  if (status === 'error') {
    return `The competency query "${query.title}" could not be evaluated. Review the issue details and retry.`;
  }

  if (status === 'covered') {
    return `The ontology pair satisfied "${query.title}" with ${evidenceCount} matching evidence item${evidenceCount === 1 ? '' : 's'}.`;
  }

  if (status === 'partially_covered') {
    const expected = query.expectedMinEvidence ?? 1;
    return `The ontology pair only returned ${evidenceCount} of the ${expected} expected evidence item${expected === 1 ? '' : 's'} for "${query.title}".`;
  }

  return `No matching evidence was found for "${query.title}".`;
}

export function mapQueryOutcome(outcome: RawQueryOutcome): QueryEvaluation {
  return {
    queryId: outcome.query.id,
    title: outcome.query.title,
    description: outcome.query.description,
    status: outcome.status,
    explanation: buildExplanation(outcome.query, outcome.status, outcome.evidenceCount),
    evidenceCount: outcome.evidenceCount,
    evidencePreview: outcome.evidencePreview,
    errorCode: outcome.errorCode,
    sourcePath: outcome.query.sourcePath,
    group: outcome.query.group
  };
}
