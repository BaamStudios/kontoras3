import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClarityModule, ClrComboboxModule, ClrDatagridModule, ClrDatagridSortOrder, ClrDropdownModule } from "@clr/angular";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { remult } from 'remult';
import { Customer } from '../../shared/entities/customer';
import { Person } from '../../shared/entities/person';
import { Company } from '../../shared/entities/company';
import { featureFlags } from '../feature-flags';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule, ClrComboboxModule, ClrDatagridModule, RouterLink, ClrDropdownModule, TranslateModule],
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss',
})
export class CrmComponent implements OnInit {
  personRepo = remult.repo(Person);
  companyRepo = remult.repo(Company);
  customers: Customer[] = [];
  featureFlags = featureFlags.crmOverview;

  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.DESC;
  constructor(private router: Router, private translate: TranslateService, private toastr: ToastrService) {} // Initialize the 'router', 'translate', and 'toastr' variables

  async ngOnInit() {
    const persons = this.featureFlags.includePersons ? await this.personRepo.find() : [];
    const companies = this.featureFlags.includeCompanies ? await this.companyRepo.find() : [];
    this.customers = [...persons, ...companies];
  }

  copyCustomerId(id: string) {
    navigator.clipboard.writeText(id);
    this.toastr.success(this.translate.instant('clipboardSuccess'));
  }

  openCustomer(entity: Customer) {
    console.log(entity.customerType)
    switch(entity.customerType) {
      case 'Person':
        this.router.navigateByUrl('/crm/person/' + entity.id); // Use 'this.router' to navigate
        break;
      case 'Company':
        this.router.navigateByUrl('/crm/company/' + entity.id); // Use 'this.router' to navigate
        break;
      default:
        return;
    }
  }
}


