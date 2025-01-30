import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FieldsMetadata, getEntityRef, remult } from 'remult';
import { Invoice } from '../../../shared/entities/invoice';
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { EditComponent } from '../../core/edit/edit.component';
import { InvoiceItemEditComponent } from '../invoice-item/invoice-item-edit.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { InvoiceItem } from '../../../shared/entities/invoice-item';

@Component({
  selector: 'app-invoice-editor',
  imports: [
    CommonModule,
    FormsModule,
    AutofieldComponent,
    RouterLink,
    TranslateModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    TableModule,
  ],
  templateUrl: './invoice-edit.component.html',
  styleUrl: './invoice-edit.component.scss',
})
export class InvoiceEditComponent extends EditComponent<Invoice> {
  repo = remult.repo(Invoice);
  override rootPath = '/om/invoice/';

  previewInvoiceNumber: string = '';

  @ViewChild(NgForm) form!: NgForm;

  constructor(router: Router) {
    super(router);
    this.returnWithEntityId = false;
  }

  getFields(item: InvoiceItem) {
    return getEntityRef(item).metadata.fields as FieldsMetadata<InvoiceItem>;
  }

  setVatType(vatType: 'Netto' | 'Brutto') {
    this.entity!.vatType = vatType;
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.entity?.items?.length == 0) {
      await this.createRelationItem('items');
    }
    this.repo.relations(this.entity!);
    this.previewInvoiceNumber = await this.entity!.previewInvoiceNumber();
  }

  ngAfterViewInit(): void {
    this.instance.registerFormForValidation(this.form);
  }
  ngOnDestroy(): void {
    this.instance.deregisterFormForValidation(this.form);
  }
}
