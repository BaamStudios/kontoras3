// filepath: src/shared/entities/company-settings.ts
import { Entity, Fields, repo } from 'remult';
import { Base } from './base';
import { SearchableEntity } from './searchable-entity';

export const legalForms = [
  'Selbstständig',
  'Einzelunternehmer',
  'Personengesellschaft (z. B. GdbR, OHG, KG)',
  'Gemeinnützig / Verein',
  'Gesellschaft in privater Hand (z. B. GmbH, UG, Ltd.)',
  'Aktiengesellschaft',
] as const;
type LegalForm = (typeof legalForms)[number];

@SearchableEntity(CompanySettings, 'companysettings', {
  allowApiCrud: true,
  searchFields: [
    'companyName',
    'companySuffix',
    'ceo',
    'legalForm',
    'street',
    'postalCode',
    'city',
    'country',
  ],
})
export class CompanySettings extends Base {
  @Fields.string({ caption: 'Firma', validate: [] })
  companyName = '';

  @Fields.string({ caption: 'Firmenzusatz' })
  companySuffix = '';

  @Fields.string({ caption: 'Geschäftsführer/-in' })
  ceo = '';

  @Fields.literal(() => legalForms, {
    caption: 'Rechtsform',
    allowNull: true,
    inputType: 'select-literal',
  })
  legalForm: LegalForm | null = null;

  @Fields.string({ caption: 'Straße' })
  street = '';

  @Fields.string({ caption: 'PLZ' })
  postalCode = '';

  @Fields.string({ caption: 'Ort' })
  city = '';

  @Fields.string({ caption: 'Land' })
  country = '';

  @Fields.string({ caption: 'Telefon' })
  phone = '';

  @Fields.string({ caption: 'Fax' })
  fax = '';

  @Fields.string({ caption: 'E-Mail-Adresse' })
  email = '';

  @Fields.string({ caption: 'Webseite' })
  website = '';

  @Fields.string({ caption: 'Bank' })
  bankName = '';

  @Fields.string({ caption: 'IBAN' })
  iban = '';

  @Fields.string({ caption: 'BIC' })
  bic = '';

  get displayName() {
    return this.companyName;
  }
}

export async function bootstrapCompanySettings() {
  //check if user admin exists:
  const count = await repo(CompanySettings).count();
  if (count == 0) {
    //create admin user
    let u = new CompanySettings();
    u.id = '1';


    await repo(CompanySettings).insert(u);
  }
}
