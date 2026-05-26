export function load() {
  const hasSparqlEndpoint = Boolean(process.env.SPARQL_ENDPOINT_URL?.trim());

  return {
    hasSparqlEndpoint
  };
}
