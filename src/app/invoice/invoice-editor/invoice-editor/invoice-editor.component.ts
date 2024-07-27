import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClarityModule, ClrCheckboxModule, ClrComboboxModule, ClrFormsModule, ClrTabsModule } from '@clr/angular';
import { remult } from 'remult';
import { Invoice } from '../../../../shared/entities/invoice';
import { AutofieldComponent } from '../../../core/autofield/autofield.component';
import { EditComponent } from '../../../core/edit/edit.component';
import { InvoiceItemEditComponent } from '../../invoice-item/invoice-item-edit.component';

@Component({
  selector: 'app-invoice-editor',
  standalone: true,
  imports: [    CommonModule,
    FormsModule,
    ClrFormsModule,
    ClarityModule,
    ClrCheckboxModule,
    ClrComboboxModule,
    AutofieldComponent,
    ClrTabsModule,
    JsonPipe,
    RouterLink,
    InvoiceItemEditComponent,],
  templateUrl: './invoice-editor.component.html',
  styleUrl: './invoice-editor.component.scss'
})
export class InvoiceEditorComponent extends EditComponent<Invoice> {
  repo = remult.repo(Invoice);
  override rootPath = '/om/invoice/';

  previewInvoiceNumber: string = '';

  constructor(router: Router) {
    super(router);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.entity?.items?.length == 0) {
      await this.createRelationItem('items');
    }
    this.repo.relations(this.entity!)
    this.previewInvoiceNumber = await this.entity!.previewInvoiceNumber();
  }

}
