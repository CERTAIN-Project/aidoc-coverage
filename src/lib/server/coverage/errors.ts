export class AnalysisError extends Error {
  status: number;
  issues: string[];
  code: string;

  constructor(message: string, status = 500, issues: string[] = [], code = 'analysis_error') {
    super(message);
    this.name = 'AnalysisError';
    this.status = status;
    this.issues = issues;
    this.code = code;
  }
}

export function toAnalysisError(error: unknown): AnalysisError {
  if (error instanceof AnalysisError) {
    return error;
  }

  if (error instanceof Error && /ontology is empty|Unexpected/.test(error.message)) {
    return new AnalysisError('One or more uploaded Turtle files could not be parsed.', 422, [error.message], 'invalid_turtle');
  }

  if (error instanceof Error && /query set/i.test(error.message)) {
    return new AnalysisError(
      'Coverage cannot be calculated until the competency-query set is available.',
      422,
      [error.message],
      'query_set_unavailable'
    );
  }

  return new AnalysisError('Coverage analysis failed unexpectedly.', 500, [error instanceof Error ? error.message : 'Unknown error']);
}
