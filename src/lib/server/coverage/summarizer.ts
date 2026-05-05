import type { CoverageSummary, QueryEvaluation } from './types';

export function summarizeResults(results: QueryEvaluation[]): CoverageSummary {
  const summary: CoverageSummary = {
    totalQueries: results.length,
    coveredCount: results.filter((result) => result.status === 'covered').length,
    partialCount: results.filter((result) => result.status === 'partially_covered').length,
    notCoveredCount: results.filter((result) => result.status === 'not_covered').length,
    errorCount: results.filter((result) => result.status === 'error').length,
    coveragePercent: 0,
    overallStatus: 'error'
  };

  const successfulQueries = summary.totalQueries - summary.errorCount;
  summary.coveragePercent =
    successfulQueries > 0 ? Number(((summary.coveredCount / successfulQueries) * 100).toFixed(1)) : 0;

  if (summary.errorCount === summary.totalQueries) {
    summary.overallStatus = 'error';
  } else if (summary.notCoveredCount > 0) {
    summary.overallStatus = 'red';
  } else if (summary.partialCount > 0 || summary.errorCount > 0) {
    summary.overallStatus = 'yellow';
  } else {
    summary.overallStatus = 'green';
  }

  return summary;
}
