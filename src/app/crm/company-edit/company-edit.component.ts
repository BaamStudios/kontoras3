import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { remult } from 'remult';
import { Company } from '../../../shared/entities/company';
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { EditComponent } from '../../core/edit/edit.component';
import { AddressEditComponent } from '../address/address-edit.component';
import { featureFlags } from '../../feature-flags';

@Component({
  selector: 'app-company-edit',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    RouterLink,
    AutofieldComponent,
    AddressEditComponent,
    TranslateModule,
  ],
  templateUrl: './company-edit.component.html',
  styleUrl: './company-edit.component.scss',
})
export class CompanyEditComponent
  extends EditComponent<Company>
  implements OnInit
{
  override repo = remult.repo(Company);

  previewCustomerNumber: string = '';

  override rootPath = '/crm/company/';
  featureFlags = featureFlags;
  constructor(router: Router) {
    super(router);
  }
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.entity?.addresses?.length == 0) {
      await this.createRelationItem('addresses');
    }
    this.repo.relations(this.entity!);
    this.previewCustomerNumber = await this.entity!.previewCustomerNumber();
  }
}
