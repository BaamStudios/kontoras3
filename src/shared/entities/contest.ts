import { Fields } from 'remult';
import { Base } from './base';
import { SearchableEntity } from './searchable-entity';

// Define the possible discipline types for the contest
export const disciplineTypes = ['Luftgewehr', 'Luftpistole'] as const;
type DisciplineType = (typeof disciplineTypes)[number];

// Decorator to make the Contest entity searchable and allow CRUD operations
@SearchableEntity(Contest, 'contests', {
  allowApiCrud: true,
  searchFields: [
    'shooterId',
    'name',
    'series',
    'shots',
    'distance',
    'disciplineType',
  ],
})
/**
 * Represents a contest entity.
 */
export class Contest extends Base {

  /**
   * The shooter ID associated with this contest.
   */
  @Fields.string({ caption: 'Schützen-ID' })
  shooterId = '';

  /**
   * The name of the contest.
   */
  @Fields.string({ caption: 'Name' })
  name = '';

  /**
   * The type of discipline for the contest.
   */
  @Fields.literal(() => disciplineTypes, {
    caption: 'Disziplin',
    allowNull: true,
    inputType: 'select-literal',
  })
  disciplineType?: DisciplineType;

  /**
   * The number of series in the contest.
   */
  @Fields.number({ caption: 'Serien' })
  series = 3;

  /**
   * The number of shots per series in the contest.
   */
  @Fields.number({ caption: 'Schussanzahl pro Serie' })
  shots = 10;

  /**
   * The distance in meters for the contest.
   */
  @Fields.number({ caption: 'Distanz in [m]' })
  distance = 10;

}
