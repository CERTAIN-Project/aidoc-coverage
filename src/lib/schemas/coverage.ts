import { z } from 'zod';

export const VALID_EXAMPLE_KEYS = ['encom', 'hr-ai', 'biometrics'] as const;
export type ExampleKey = (typeof VALID_EXAMPLE_KEYS)[number];

export const exampleSelectionSchema = z.object({
  instantiatedExample: z.enum(VALID_EXAMPLE_KEYS)
});
