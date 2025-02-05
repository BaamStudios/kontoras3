import { bootstrapCompanySettings } from '../shared/entities/company-settings';
import { bootstrapNumberRanges } from '../shared/entities/number-range';
import { bootstrapFirstAdminUser } from '../shared/entities/user';

export async function bootstrap() {
  await bootstrapNumberRanges();
  await bootstrapFirstAdminUser();
  await bootstrapCompanySettings();
}

