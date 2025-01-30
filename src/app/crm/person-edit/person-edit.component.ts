import { Component, OnInit } from '@angular/core';
import { Person } from '../../../shared/entities/person';
import { remult } from 'remult';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { EditComponent } from '../../core/edit/edit.component';
import { AddressEditComponent } from '../address/address-edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { featureFlags } from '../../feature-flags';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-person-edit',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    CardModule,
    AutofieldComponent,
    RouterLink,
    AddressEditComponent,
    TranslateModule,
  ],
  templateUrl: './person-edit.component.html',
  styleUrl: './person-edit.component.scss',
})
export class PersonEditComponent extends EditComponent<Person> {
  repo = remult.repo(Person);
  override rootPath = '/crm/person/';

  previewCustomerNumber: string = '';
  featureFlags = featureFlags.personEdit;

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
