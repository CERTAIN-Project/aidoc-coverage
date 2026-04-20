import { z } from 'zod';

const supportedTypes = ['text/turtle', 'application/x-turtle', 'application/octet-stream', ''];

export const uploadedOntologySchema = z.object({
  name: z.string().min(1, 'A Turtle file is required.'),
  size: z.number().gt(0, 'Uploaded files must not be empty.'),
  type: z
    .string()
    .refine((type) => supportedTypes.includes(type), 'Only Turtle uploads are supported.')
});

export const analysisRequestSchema = z.object({
  originatingOntology: z.instanceof(File),
  instantiatedOntology: z.instanceof(File)
});

export function validateAnalysisRequest(files: { originatingOntology: File; instantiatedOntology: File }) {
  analysisRequestSchema.parse(files);
  uploadedOntologySchema.parse({
    name: files.originatingOntology.name,
    size: files.originatingOntology.size,
    type: files.originatingOntology.type
  });
  uploadedOntologySchema.parse({
    name: files.instantiatedOntology.name,
    size: files.instantiatedOntology.size,
    type: files.instantiatedOntology.type
  });
}
