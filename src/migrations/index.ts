import * as migration_20260731_014053_add_structured_feature_use_case_content from './20260731_014053_add_structured_feature_use_case_content';
import * as migration_20260813_044846_smartcounter_product_truth from './20260813_044846_smartcounter_product_truth';

export const migrations = [
  {
    up: migration_20260731_014053_add_structured_feature_use_case_content.up,
    down: migration_20260731_014053_add_structured_feature_use_case_content.down,
    name: '20260731_014053_add_structured_feature_use_case_content',
  },
  {
    up: migration_20260813_044846_smartcounter_product_truth.up,
    down: migration_20260813_044846_smartcounter_product_truth.down,
    name: '20260813_044846_smartcounter_product_truth'
  },
];
