import { Component, Input } from '@angular/core';
import { Customer } from '../../../shared/entities/customer';
import { Address } from '../../../shared/entities/address';
import { CommonModule } from '@angular/common';
import { ClarityModule, ClrAlertModule } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-address-view',
    imports: [CommonModule, ClarityModule, ClrAlertModule, TranslateModule],
    templateUrl: './address-view.component.html',
    styleUrl: './address-view.component.scss'
})
export class AddressViewComponent {
  @Input()
  address!: Address;
  @Input()
  entity!: Customer;

  constructor(private toastr: ToastrService, private translate: TranslateService) {}

  async copy() {
    console.log('copying address to clipboard');
    const addressText = `${this.entity.displayName}\n${this.address.street}\n${this.address.zip} ${this.address.city}\n${this.address.country} `;
    try {
      await navigator.clipboard.writeText(addressText);
      this.toastr.success(this.translate.instant('addressCopySuccess'));
    } catch (error) {
      this.toastr.error(this.translate.instant('addressCopyError'));
    }
  }
}
