import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Person } from '../../../shared/entities/person';
import { remult, getValueList, FieldMetadata, FieldValidator } from 'remult';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ClarityModule,
  ClrCheckboxModule,
  ClrComboboxModule,
  ClrFormsModule,
  ClrTabsModule,
} from '@clr/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Import the Router module
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { EditComponent } from '../../core/edit/edit.component';
import { AddressEditComponent } from '../address/address-edit.component';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { featureFlags } from '../../feature-flags'; // Fix import path

@Component({
    selector: 'app-person-edit',
    imports: [
        CommonModule,
        FormsModule,
        ClrFormsModule,
        ClarityModule,
        ClrCheckboxModule,
        ClrComboboxModule,
        AutofieldComponent,
        ClrTabsModule,
        RouterLink,
        AddressEditComponent,
        TranslateModule, // Add TranslateModule to imports
    ],
    templateUrl: './person-edit.component.html',
    styleUrl: './person-edit.component.scss'
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
    this.repo.relations(this.entity!)
    this.previewCustomerNumber = await this.entity!.previewCustomerNumber();
  }
}
