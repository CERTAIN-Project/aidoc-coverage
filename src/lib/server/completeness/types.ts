export type OntologyTypeName =
  | 'owl:Class'
  | 'owl:ObjectProperty'
  | 'owl:DatatypeProperty'
  | 'owl:NamedIndividual';

export interface OntologyTypeResult {
  type: OntologyTypeName;
  count: number;
  values: string[];
}

export interface OntologyTypesReport {
  ontologyUrl: string;
  results: OntologyTypeResult[];
}

export interface TypeUsageEntry {
  value: string;
  count: number;
  used: boolean;
  instances: string[];
}

export interface TypeUsageResult {
  type: OntologyTypeName;
  totalDefined: number;
  usedCount: number;
  usagePercent: number;
  entries: TypeUsageEntry[];
}

export interface CompletenessReport {
  ontologyUrl: string;
  results: TypeUsageResult[];
  overallUsagePercent: number;
}
