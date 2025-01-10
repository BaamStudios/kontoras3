import { Fields, Relations } from 'remult';
import { Base } from './base';
import { SearchableEntity } from './searchable-entity';
import { Person } from './person';
import { Contest } from './contest';

// Define the possible anschlag types for the contest
export const anschlagTypes = ['stehend', 'sitzend', 'liegend'] as const;
type AnschlagType = (typeof anschlagTypes)[number];

// Decorator to make the Contest entity searchable and allow CRUD operations
@SearchableEntity(Shooting, 'shootings', {
  allowApiCrud: true,
  searchFields: ['shootingDate', 'rings', 'points', 'anschlag', 'support'],
})
/**
 * Represents a shooting entity of a contest.
 */
export class Shooting extends Base {
  /**
   * The name of the contest.
   */
  @Fields.date({ caption: 'Datum' })
  shootingDate = new Date();

  @Fields.string({ caption: 'Schützen-ID', dbName: 'shooterId' })
  shooterId = "";
  @Relations.toOne<Shooting,Person>(() => Person, 'shooterId')
  shooter?: Person;

  @Fields.string({ caption: 'Schützen-ID', dbName: 'contestId' })
  contestId = "";
  @Relations.toOne<Shooting,Contest>(() => Contest, 'contestId')
  contest?: Contest;

  /**
   * The number of targets in series in the contest.
   */
  @Fields.number({ caption: 'Ringzahl' })
  rings = 0;

  /**
   * The number of shots per target in this series.
   */
  @Fields.number({ caption: 'Punktzahl' })
  points = 0;

  /**
   * The anschlag.
   */
  @Fields.literal(() => anschlagTypes, {
    caption: 'Anschlag',
    allowNull: true,
    inputType: 'select-literal',
  })
  anschlag: AnschlagType = 'stehend';

  @Fields.boolean({ caption: 'Auflage' })
  support = true;
}
