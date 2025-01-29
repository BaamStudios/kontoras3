import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NgForm,
  ValidationErrors,
} from '@angular/forms';
import { FieldMetadata, getEntityRef, getValueList } from 'remult';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-autofield',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    MessageModule,
    TextareaModule,
    InputGroupModule,
    InputGroupAddonModule,
    IftaLabelModule,
    SelectModule,
  ],
  templateUrl: './autofield.component.html',
  styleUrl: './autofield.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class AutofieldComponent {
  @Input()
  width: string = '100%';

  @Input()
  rows: string = '4';

  @Input()
  showLabel = true;

  @Input()
  entity!: any;

  @Output()
  entityChange = new EventEmitter<any>();

  @Input()
  field!: FieldMetadata;

  @Input()
  helperText: string = '';

  @Input()
  label: string = '';

  @Input()
  placeholder: string = '';

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
        ?.setErrors(
          result?.modelState[this.field.key] as unknown as ValidationErrors
        );
    }
  }
}
