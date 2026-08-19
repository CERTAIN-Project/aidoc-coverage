import { QueryEngine } from '@comunica/query-sparql';

import type { OntologyTypeName, OntologyTypeResult, OntologyTypesReport } from './types';

export const ONTOLOGY_URL =
  'https://raw.githubusercontent.com/CERTAIN-Project/aidoc-ap/refs/heads/main/aidoc-ap.ttl';

const NAMESPACE_FILTER = 'https://w3id.org/aidoc-ap#';

const ONTOLOGY_TYPES: OntologyTypeName[] = [
  'owl:Class',
  'owl:ObjectProperty',
  'owl:DatatypeProperty',
  'owl:NamedIndividual'
];

const engine = new QueryEngine();

function buildTypeQuery(type: OntologyTypeName): string {
  return `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT ?s
    WHERE {
      ?s a ${type} .
      FILTER (STRSTARTS(str(?s), '${NAMESPACE_FILTER}'))
    }
  `;
}

async function queryType(type: OntologyTypeName): Promise<OntologyTypeResult> {
  const result = await engine.queryBindings(buildTypeQuery(type), {
    sources: [ONTOLOGY_URL]
  });

  const bindings = await result.toArray();
  const values = bindings.map((binding) => binding.get('s')?.value ?? '').filter(Boolean);

  return {
    type,
    count: values.length,
    values
  };
}

export async function getOntologyTypes(): Promise<OntologyTypesReport> {
  const results = await Promise.all(ONTOLOGY_TYPES.map((type) => queryType(type)));

  return {
    ontologyUrl: ONTOLOGY_URL,
    results
  };
}
