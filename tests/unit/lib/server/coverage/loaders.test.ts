// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { createChecksum, loadOntologyFile } from '$lib/server/coverage/loaders';

describe('loaders', () => {
  it('createChecksum_sameContent_sameDigest', () => {
    expect(createChecksum('abc')).toEqual(createChecksum('abc'));
  });

  it('loadOntologyFile_validTurtle_returnsParsedOntology', async () => {
    const file = {
      name: 'originating.ttl',
      size: 92,
      type: 'text/turtle',
      text: async () =>
        '@prefix aidoc: <https://w3id.org/aidoc-ap#> . <https://example.com/system> a aidoc:AISystem .'
    } as File;

    const ontology = await loadOntologyFile(file, 'originating');

    expect(ontology.filename).toBe('originating.ttl');
    expect(ontology.store.size).toBeGreaterThan(0);
  });
});
