import { QueryEngine } from '@comunica/query-sparql';

import { mergeStores } from '../coverage/engine';
import type { CoverageAnalysisOptions, ParsedOntologyInput } from '../coverage/types';
import { getOntologyTypes } from './ontology-types';
import type {
  CompletenessReport,
  OntologyTypeName,
  OntologyTypeResult,
  TypeUsageEntry,
  TypeUsageResult
} from './types';

const engine = new QueryEngine();
type QueryBindingsOptions = NonNullable<Parameters<QueryEngine['queryBindings']>[1]>;
type QuerySource = QueryBindingsOptions['sources'][number];

type UsageQueryKind = 'class' | 'property' | 'individual';

const USAGE_QUERY_KIND: Record<OntologyTypeName, UsageQueryKind> = {
  'owl:Class': 'class',
  'owl:ObjectProperty': 'property',
  'owl:DatatypeProperty': 'property',
  'owl:NamedIndividual': 'individual'
};

function buildUsageQuery(kind: UsageQueryKind, values: string[]): string {
  const valueList = values.map((value) => `<${value}>`).join(' ');

  switch (kind) {
    case 'class':
      // Find the instances typed with each class.
      return `
        SELECT ?term ?match
        WHERE {
          VALUES ?term { ${valueList} }
          OPTIONAL { ?match a ?term }
        }
      `;
    case 'property':
      // Find the subjects using each property as predicate.
      return `
        SELECT ?term ?match
        WHERE {
          VALUES ?term { ${valueList} }
          OPTIONAL { ?match ?term ?object }
        }
      `;
    case 'individual':
      // Find where the individual appears as subject or object.
      return `
        SELECT ?term ?match
        WHERE {
          VALUES ?term { ${valueList} }
          OPTIONAL {
            { ?term ?predicate1 ?object1 . BIND(?term AS ?match) }
            UNION
            { ?subject2 ?predicate2 ?term . BIND(?term AS ?match) }
          }
        }
      `;
  }
}

function buildSources(inputs: ParsedOntologyInput[], options: CoverageAnalysisOptions): QuerySource[] {
  const sources: QuerySource[] = [mergeStores(inputs)];

  if (options.sparqlEndpointUrl) {
    sources.push({ type: 'sparql', value: options.sparqlEndpointUrl });
  }

  return sources;
}

async function queryUsage(
  type: OntologyTypeName,
  ontologyResult: OntologyTypeResult,
  sources: QuerySource[]
): Promise<TypeUsageResult> {
  const totalDefined = ontologyResult.values.length;

  if (totalDefined === 0) {
    return { type, totalDefined: 0, usedCount: 0, usagePercent: 0, entries: [] };
  }

  const kind = USAGE_QUERY_KIND[type];
  const result = await engine.queryBindings(buildUsageQuery(kind, ontologyResult.values), { sources });
  const bindings = await result.toArray();

  const matches = new Map<string, Set<string>>();
  for (const binding of bindings) {
    const term = binding.get('term')?.value;
    const match = binding.get('match')?.value;

    if (term && match) {
      const termMatches = matches.get(term) ?? new Set<string>();
      termMatches.add(match);
      matches.set(term, termMatches);
    }
  }

  const entries: TypeUsageEntry[] = ontologyResult.values.map((value) => {
    const termMatches = matches.get(value) ?? new Set<string>();
    return {
      value,
      count: termMatches.size,
      used: termMatches.size > 0,
      instances: Array.from(termMatches)
    };
  });

  const usedCount = entries.filter((entry) => entry.used).length;

  return {
    type,
    totalDefined,
    usedCount,
    usagePercent: Math.round((usedCount / totalDefined) * 10000) / 100,
    entries
  };
}

export async function analyzeCompleteness(
  inputs: ParsedOntologyInput[],
  options: CoverageAnalysisOptions = {}
): Promise<CompletenessReport> {
  const ontologyTypes = await getOntologyTypes();
  const sources = buildSources(inputs, options);

  const results = await Promise.all(
    ontologyTypes.results.map((ontologyResult) => queryUsage(ontologyResult.type, ontologyResult, sources))
  );

  const totalDefined = results.reduce((sum, result) => sum + result.totalDefined, 0);
  const totalUsed = results.reduce((sum, result) => sum + result.usedCount, 0);

  return {
    ontologyUrl: ontologyTypes.ontologyUrl,
    results,
    overallUsagePercent: totalDefined === 0 ? 0 : Math.round((totalUsed / totalDefined) * 10000) / 100
  };
}
