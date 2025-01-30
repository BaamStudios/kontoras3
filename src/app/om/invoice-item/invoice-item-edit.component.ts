import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FieldsMetadata, getEntityRef } from 'remult';
import { Invoice } from '../../../shared/entities/invoice';
import { InvoiceItem } from '../../../shared/entities/invoice-item';
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { EditComponent } from '../../core/edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-invoice-item-edit',
  imports: [
    AutofieldComponent,
    FormsModule,
    TranslateModule,
    CommonModule,
    ButtonModule,
    RippleModule,
  ],
  templateUrl: './invoice-item-edit.component.html',
  styleUrl: './invoice-item-edit.component.scss',
})
export class InvoiceItemEditComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() item!: InvoiceItem;
  fields!: FieldsMetadata<InvoiceItem>;

  @Input() parent!: EditComponent<Invoice>;

  @ViewChild(NgForm) form!: NgForm;

  constructor() {}

  ngOnInit(): void {
    if (this.item) {
      this.fields = getEntityRef(this.item).metadata
        .fields as FieldsMetadata<InvoiceItem>;
    }
  }

  ngAfterViewInit(): void {
    this.parent.registerFormForValidation(this.form);
  }
  ngOnDestroy(): void {
    this.parent.deregisterFormForValidation(this.form);
  }
}
