import { bootstrapNumberRanges } from '../shared/entities/number-range';
import { bootstrapFirstAdminUser } from '../shared/entities/user';

export async function bootstrap() {
  await bootstrapNumberRanges();
  await bootstrapFirstAdminUser();
}
