import type { Store } from 'n3';

export type OntologyRole = 'originating' | 'instantiated';
export type CoverageStatus = 'covered' | 'partially_covered' | 'not_covered' | 'error';
export type SummaryStatus = 'green' | 'yellow' | 'red' | 'error';
export type ResultFilterStatus = 'all' | CoverageStatus;

export interface OntologyInput {
  role: OntologyRole;
  filename: string;
  mediaType: string;
  content: string;
  sizeBytes: number;
  checksum: string;
}

export interface ParsedOntologyInput extends OntologyInput {
  store: Store;
}

export interface QueryManifestEntry {
  id: string;
  title: string;
  description?: string;
  group?: string;
  sourcePath: string;
  expectedMinEvidence?: number;
}

export interface QueryDefinition extends QueryManifestEntry {
  queryText: string;
}

export interface QueryEvaluation {
  queryId: string;
  title: string;
  description?: string;
  status: CoverageStatus;
  explanation: string;
  evidenceCount: number;
  evidencePreview?: string[];
  errorCode?: string;
  sourcePath: string;
  group?: string;
}

export interface CoverageSummary {
  totalQueries: number;
  coveredCount: number;
  partialCount: number;
  notCoveredCount: number;
  errorCount: number;
  coveragePercent: number;
  overallStatus: SummaryStatus;
}

export interface CoverageAnalysisResponse {
  runId: string;
  summary: CoverageSummary;
  results: QueryEvaluation[];
  warnings: string[];
}

export interface QuerySet {
  version: string;
  queries: QueryDefinition[];
}

export interface CoverageAnalysisOptions {
  sparqlEndpointUrl?: string;
}

export interface RawQueryOutcome {
  query: QueryDefinition;
  evidenceCount: number;
  evidencePreview: string[];
  status: CoverageStatus;
  errorCode?: string;
}
