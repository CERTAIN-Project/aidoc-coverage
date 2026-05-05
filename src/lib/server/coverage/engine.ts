import { randomUUID } from 'node:crypto';

import { QueryEngine } from '@comunica/query-sparql';
import { Store } from 'n3';

import { mapQueryOutcome } from './mapper';
import { summarizeResults } from './summarizer';
import type {
  CoverageAnalysisResponse,
  ParsedOntologyInput,
  QueryDefinition,
  QueryEvaluation,
  RawQueryOutcome
} from './types';

const engine = new QueryEngine();

function mergeStores(inputs: ParsedOntologyInput[]) {
  const merged = new Store();

  for (const input of inputs) {
    merged.addQuads(input.store.getQuads(null, null, null, null));
  }

  return merged;
}

interface TermLike {
  termType?: string;
  value?: string;
  language?: string;
  datatype?: { value?: string };
  toString?: () => string;
}

function formatBindingPart(part: unknown, options?: { isKey?: boolean }): string {
  if (part && typeof part === 'object') {
    const term = part as TermLike;

    if (typeof term.termType === 'string' && typeof term.value === 'string') {
      switch (term.termType) {
        case 'Variable':
          return `?${term.value}`;
        case 'NamedNode':
          return `<${term.value}>`;
        case 'BlankNode':
          return `_:${term.value}`;
        case 'Literal': {
          const literal = `"${term.value}"`;

          if (term.language) {
            return `${literal}@${term.language}`;
          }

          const datatypeValue = term.datatype?.value;
          return datatypeValue && datatypeValue !== 'http://www.w3.org/2001/XMLSchema#string'
            ? `${literal}^^<${datatypeValue}>`
            : literal;
        }
        case 'DefaultGraph':
          return options?.isKey ? '?graph' : 'default';
        default:
          break;
      }
    }

    if (typeof term.toString === 'function') {
      const rendered = term.toString();
      if (rendered && rendered !== '[object Object]') {
        return rendered;
      }
    }
  }

  return String(part);
}

function bindingValueToString(binding: unknown) {
  return Array.from(binding as Iterable<[unknown, unknown]>)
    .map(([key, value]: [unknown, unknown]) => `${formatBindingPart(key, { isKey: true })}=${formatBindingPart(value)}`)
    .join(', ');
}

async function executeQuery(query: QueryDefinition, store: Store): Promise<RawQueryOutcome> {
  try {
    const result = await engine.queryBindings(query.queryText, {
      sources: [store]
    });

    const bindings = await result.toArray();
    const evidenceCount = bindings.length;
    const expectedMinEvidence = query.expectedMinEvidence ?? 1;
    const status =
      evidenceCount === 0 ? 'not_covered' : evidenceCount < expectedMinEvidence ? 'partially_covered' : 'covered';

    return {
      query,
      evidenceCount,
      evidencePreview: bindings.slice(0, 5).map((binding) => bindingValueToString(binding)),
      status
    };
  } catch (error) {
    return {
      query,
      evidenceCount: 0,
      evidencePreview: [],
      status: 'error',
      errorCode: error instanceof Error ? error.name : 'query_execution_error'
    };
  }
}

export async function analyzeCoverage(
  inputs: ParsedOntologyInput[],
  queries: QueryDefinition[]
): Promise<CoverageAnalysisResponse> {
  const store = mergeStores(inputs);
  const rawOutcomes = await Promise.all(queries.map((query) => executeQuery(query, store)));
  const results: QueryEvaluation[] = rawOutcomes.map(mapQueryOutcome);
  const summary = summarizeResults(results);

  return {
    runId: randomUUID(),
    summary,
    results,
    warnings: []
  };
}
