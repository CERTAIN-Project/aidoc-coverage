import type { CompletenessReport, OntologyTypeName } from '$lib/server/completeness/types';

export interface CompletenessEntry {
  type: OntologyTypeName;
  value: string;
  label: string;
  count: number;
  used: boolean;
  instances: string[];
}

export type CompletenessFilterStatus = 'all' | 'used' | 'unused';
export type CompletenessFilterType = 'all' | OntologyTypeName;

export function labelForValue(value: string): string {
  const match = value.match(/[#/]([^#/]+)$/);
  return match ? match[1] : value;
}

export function flattenCompleteness(report: CompletenessReport): CompletenessEntry[] {
  return report.results.flatMap((result) =>
    result.entries.map((entry) => ({
      type: result.type,
      value: entry.value,
      label: labelForValue(entry.value),
      count: entry.count,
      used: entry.used,
      instances: entry.instances ?? []
    }))
  );
}
