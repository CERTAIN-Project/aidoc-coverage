import { z } from 'zod';

export const sparqlEndpointConfigSchema = z.object({
  sparqlEndpointUrl: z
    .string()
    .trim()
    .url()
    .refine((value) => /^https?:\/\//i.test(value), {
      message: 'SPARQL endpoint URL must start with http:// or https://'
    })
});
