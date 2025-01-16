export const featureFlags = {
  navigation: {
    showCustomerOverview: true,
    showNewInvoice: false,
  },
  crmOverview: {
    enabled: true,
    showIdColumn: true,
    showTypeColumn: true,
    showNameColumn: true,
    showCreatedAtColumn: true,
    showUpdatedAtColumn: true,
    includePersons: true,
    includeCompanies: false,
    enableCompanyCreation: false,
    enablePersonCreation: true,
  },
  schuetzeOverview: {
    enabled: true,
    showIdColumn: true,
    showNameColumn: true,
    showCreatedAtColumn: true,
    showUpdatedAtColumn: true,
    showShooterIdColumn: true,
    showSeriesColumn: true,
    showShotsColumn: true,
    showDistanceColumn: true,
    showDisciplineTypeColumn: true,
  },
  personView: {
    showPerson: true,
    showCustomerNumber: true,
    showCreatedAt: true,
    showAddresses: true,
    showBirthdate: true,
  },
  companyView: {
    showCompanyName: true,
    showCustomerNumber: true,
    showCreatedAt: true,
    showAddresses: true
  },
  companyEdit: {
    showNameField: true,
    showCustomerNumberField: true,
    showAddresses: true,
    showContactDetails: true,
    showPaymentInformation: true,
    showConditions: true,
    showAdditional: true
  },
  personEdit: {
    showSalutation: true,
    showFirstname: true,
    showLastname: true,
    showCustomerNumber: true,
    showBirthdate: true,
    showAddresses: true,
    showContactDetails: true,
    showPaymentInformation: true,
    showConditions: true,
    showAdditional: true,
  }
};
