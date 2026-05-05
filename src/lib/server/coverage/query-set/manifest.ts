import type { QueryManifestEntry } from '../types';

const queryAssetFiles = [
  'cq1_1-what_is_the_intended_purpose_of_the_ai_system.sparql',
  'cq1_2-what_is_the_name_of_the_provider.sparql',
  'cq1_3-what_is_the_version_of_the_system_and_its_relation_to_previous_versions.sparql',
  'cq2_1-what_components_or_other_systems_does_it_depend_on.sparql',
  'cq3_1-what_software_dependencies_are_used_how_are_versions_tracked_and_updated.sparql',
  'cq4_1-how_is_the_ai_system_provided_to_users.sparql',
  'cq5_1-what_hardware_does_the_ai_system_need_to_run.sparql',
  'cq6_1-what_is_the_physical_form_of_the_product.sparql',
  'cq6_2-what_visual_documentation_exists_showing_external_features.sparql',
  'cq6_3-what_markings_are_present_on_the_product.sparql',
  'cq6_4-how_is_the_internal_layout_or_component_arrangement_documented.sparql',
  'cq7_1-what_interface_is_provided_for_operators_or_deployers.sparql',
  'cq7_2-what_instructions_for_use_are_provided_to_the_deployer.sparql',
  'cq8_1-what_are_the_components_and_steps_of_development.sparql',
  'cq9_1-what_is_the_general_logic_of_the_ai_system_and_of_the_algorithms.sparql',
  'cq9_2-what_are_the_key_design_choices_including_the_rationale_and_assumptions_made.sparql',
  'cq9_3-with_regard_to_which_persons_or_groups_is_the_system_intended_to_be_used.sparql',
  'cq9_4-what_are_the_main_classification_choices.sparql',
  'cq9_5-what_is_the_system_designed_to_optimise_for_and_relevance_of_parameters.sparql',
  'cq9_6-what_is_the_description_of_the_expected_output_and_output_quality.sparql',
  'cq9_7-what_decisions_about_trade_offs_were_made_for_compliance.sparql',
  'cq10_1-what_is_the_architecture_and_what_algorithms_are_used.sparql',
  'cq10_2-which_software_components_make_up_the_system_and_how_are_they_connected.sparql',
  'cq10_3-how_do_software_components_feed_into_each_other.sparql',
  'cq10_4-which_computational_resources_are_used_for_development_training_testing_validation.sparql',
  'cq11_1-what_are_the_datasheets_describing_the_training_methodologies_and_techniques.sparql',
  'cq11_2-what_are_the_training_data_sets_used_including_provenance_scope_characteristics.sparql',
  'cq11_3-how_was_the_data_obtained_and_selected.sparql',
  'cq11_4-what_are_the_labelling_procedures.sparql',
  'cq11_5-what_are_the_data_cleaning_methodologies.sparql',
  'cq12_1-what_human_oversight_measures_are_needed.sparql',
  'cq12_2-what_technical_measures_are_needed_to_facilitate_output_interpretation.sparql',
  'cq13_1-what_are_the_pre_determined_changes_to_the_ai_system_and_its_performance.sparql',
  'cq13_2-what_technical_solutions_are_adopted_to_ensure_continuous_compliance.sparql',
  'cq14_1-what_validation_and_testing_procedures_are_used.sparql',
  'cq14_2-what_are_the_validation_and_testing_data_used_and_their_characteristics.sparql',
  'cq14_3-what_metrics_are_used_to_measure_accuracy_robustness_and_compliance.sparql',
  'cq14_4-are_test_logs_and_test_reports_available_dated_and_signed.sparql',
  'cq15_1-what_cybersecurity_measures_are_put_in_place.sparql',
  'cq16_1-what_are_the_capabilities_and_limitations_in_performance.sparql',
  'cq16_2-what_are_the_foreseeable_unintended_outcomes_and_sources_of_risks.sparql',
  'cq16_3-what_human_oversight_and_technical_measures_for_output_interpretation_are_needed.sparql',
  'cq17_1-what_is_the_description_of_the_appropriateness_of_the_performance_metrics.sparql',
  'cq18_1-what_is_the_detailed_description_of_the_risk_management_system.sparql',
  'cq19_1-what_changes_have_been_made_to_the_system_through_its_lifecycle.sparql',
  'cq20_1-what_harmonised_standards_have_been_applied.sparql',
  'cq20_2-if_no_harmonised_standards_what_solutions_are_adopted.sparql',
  'cq21_1-is_there_a_copy_of_the_eu_declaration_of_conformity.sparql',
  'cq22_1-what_system_is_established_to_evaluate_performance_in_post_market_phase.sparql',
  'cq22_2-is_there_a_post_market_monitoring_plan.sparql'
] as const;

function toSentenceCase(value: string): string {
  if (!value) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
}

function toRequirementGroup(filename: string): string | undefined {
  const groupMatch = filename.match(/^cq(\d+)_/i);

  return groupMatch ? `Requirement ${groupMatch[1]}` : undefined;
}

function toTitle(filename: string): string {
  const titleSource = filename
    .replace(/\.sparql$/i, '')
    .replace(/^cq\d+_\d+-/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  return toSentenceCase(titleSource);
}

const expectedMinEvidenceOverrides: Record<string, number> = {
  // Historical thresholds preserved from the previous query set behavior.
  // cq1_3: 2,
  // cq2_1: 2
};

export const coverageQueryManifest: QueryManifestEntry[] = queryAssetFiles.map((filename) => ({
  id: filename.replace(/\.sparql$/i, ''),
  title: toTitle(filename),
  group: toRequirementGroup(filename),
  sourcePath: `src/lib/server/coverage/query-set/assets/${filename}`,
  expectedMinEvidence: expectedMinEvidenceOverrides[filename.match(/^cq\d+_\d+/i)?.[0] ?? ''] ?? 1
}));
