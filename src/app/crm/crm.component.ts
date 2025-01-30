import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { remult } from 'remult';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Customer } from '../../shared/entities/customer';
import { Person } from '../../shared/entities/person';
import { Company } from '../../shared/entities/company';
import { featureFlags } from '../feature-flags';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    MenuModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    CardModule,
  ],
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss',
})
export class CrmComponent implements OnInit {
  personRepo = remult.repo(Person);
  companyRepo = remult.repo(Company);
  customers: Customer[] = [];
  featureFlags = featureFlags.crmOverview;

  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.menuItems = [
      {
        label: this.translate.instant('person'),
        icon: 'pi pi-user',
        visible: this.featureFlags.enablePersonCreation,
        command: () => this.router.navigate(['/crm/person', 'new', 'edit']),
      },
      {
        label: this.translate.instant('company'),
        icon: 'pi pi-building',
        visible: this.featureFlags.enableCompanyCreation,
        command: () => this.router.navigate(['/crm/company', 'new', 'edit']),
      },
    ];
  }

  async ngOnInit() {
    const persons = this.featureFlags.includePersons
      ? await this.personRepo.find()
      : [];
    const companies = this.featureFlags.includeCompanies
      ? await this.companyRepo.find()
      : [];
    this.customers = [...persons, ...companies];
  }

  copyCustomerId(id: string) {
    navigator.clipboard.writeText(id);
    this.toastr.success(this.translate.instant('clipboardSuccess'));
  }

  openCustomer(entity: Customer) {
    console.log(entity.customerType);
    switch (entity.customerType) {
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
