import { env } from '$env/dynamic/private';

const isPagesBuild = process.env.DEPLOY_TARGET === 'pages';

export const prerender = isPagesBuild;

export function load() {
  const sparqlEndpointUrl = env.SPARQL_ENDPOINT_URL ?? process.env.SPARQL_ENDPOINT_URL;
  const hasSparqlEndpoint = isPagesBuild ? false : Boolean(sparqlEndpointUrl?.trim());

  return {
    hasSparqlEndpoint,
    isPagesBuild
  };
}
