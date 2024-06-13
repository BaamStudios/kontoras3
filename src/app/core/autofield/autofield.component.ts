import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
  ValidationErrors,
} from '@angular/forms';
import {
  ClarityModule,
  ClrCheckboxModule,
  ClrComboboxModule,
  ClrFormsModule,
} from '@clr/angular';
import { FieldMetadata, getEntityRef, getValueList } from 'remult';

@Component({
  selector: 'app-autofield',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClrFormsModule,
    ClarityModule,
    ClrCheckboxModule,
    ClrComboboxModule,
  ],
  templateUrl: './autofield.component.html',
  styleUrl: './autofield.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class AutofieldComponent {
  @Input()
  entity!: any;

  @Output()
  entityChange = new EventEmitter<any>();

  @Input()
  field!: FieldMetadata;

  @Input()
  helperText: string = "";

  constructor(public form: NgForm) {}

  getOptionValues(field: string) {
    return getValueList(this.field);
  }

  async onBlur($event: FocusEvent) {
    const ref = getEntityRef(this.entity);
    console.log(ref);
    const result = await ref.validate();
    if (result && result.modelState) {
      this.form.form
        .get(this.field.key)
        ?.setErrors(result?.modelState[this.field.key] as unknown as ValidationErrors);
    }
  }
}