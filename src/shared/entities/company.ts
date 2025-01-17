import { Fields, LifecycleEvent, Validators } from 'remult';
import { Customer } from './customer';
import { SearchableEntity } from './searchable-entity';

@SearchableEntity(Company, 'companys', {
  allowApiCrud: true,
  searchFields: ['name', 'customerNumber'],
  deleted: async (company, e) => {
      await Customer.onDeleted(company,e as LifecycleEvent<Customer>);
  },
  saving: async (entity, event) => {
      if (!entity.customerNumber) {
        entity.sequenceNumber = await entity.createSequenceNumber();
        entity.customerNumber = await entity.createCustomerNumber(entity.sequenceNumber);
        if (await event.repository.findOne({ where: { customerNumber: entity.customerNumber } })) {
          throw new Error('Kundennummer bereits vergeben');
        }
      }
  },
})
/**
 * Represents a company entity.
 * @extends Customer
 */
export class Company extends Customer {
  /**
   * The name of the organization.
   * @remarks This field is required.
   */
  @Fields.string({
    caption: 'Name der Organisation',
    validate: [
      Validators.required(
        'Bitte geben Sie einen Namen für die Organisation ein.'
      ),
    ],
  })
  name = '';

  /**
   * The name addon for the organization.
   */
  @Fields.string({ caption: 'Namenszusatz' })
  nameAddon = '';

  get displayName() {
    return this.name;
  }

  get customerType() {
    return 'Company';
  }
}
