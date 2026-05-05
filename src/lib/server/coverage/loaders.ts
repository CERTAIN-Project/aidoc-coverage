import { createHash } from 'node:crypto';

import { Parser, Store } from 'n3';

import type { OntologyRole, ParsedOntologyInput } from './types';

export function createChecksum(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

export function parseTurtle(content: string): Store {
  const parser = new Parser({ format: 'text/turtle' });
  const quads = parser.parse(content);
  return new Store(quads);
}

async function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    return file.text();
  }

  if (typeof file.arrayBuffer === 'function') {
    return Buffer.from(await file.arrayBuffer()).toString('utf8');
  }

  throw new Error('Uploaded file content could not be read.');
}

export async function loadOntologyFile(file: File, role: OntologyRole): Promise<ParsedOntologyInput> {
  const content = await readFileText(file);

  if (!content.trim()) {
    throw new Error(`${role} ontology is empty.`);
  }

  const store = parseTurtle(content);

  return {
    role,
    filename: file.name,
    mediaType: file.type || 'text/turtle',
    content,
    sizeBytes: file.size,
    checksum: createChecksum(content),
    store
  };
}

export function loadOntologyFromContent(content: string, filename: string, role: OntologyRole): ParsedOntologyInput {
  if (!content.trim()) {
    throw new Error(`${role} ontology is empty.`);
  }

  const store = parseTurtle(content);

  return {
    role,
    filename,
    mediaType: 'text/turtle',
    content,
    sizeBytes: Buffer.byteLength(content, 'utf8'),
    checksum: createChecksum(content),
    store
  };
}
