import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ClrIconModule,
  ClrNavigationModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { featureFlags } from '../feature-flags';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu'; // Add this import

@Component({
    selector: 'app-navigation',
    imports: [
        CommonModule,
        ClrNavigationModule,
        ClrIconModule,
        ClrVerticalNavModule,
        TranslateModule,
        MenuModule // Add this module
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  featureFlags = featureFlags;
  items: MenuItem[]  = [
    {
      label: 'Kunden',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Customer Overview',
          routerLink: './crm/overview',
          visible: this.featureFlags.navigation.showCustomerOverview
        }
      ]
    },
    {
      label: 'Rechnungen',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Invoice Overview',
          routerLink: './om/invoice',
          visible: this.featureFlags.navigation.showInvoiceOverview
        },
        {
          label: 'Neue Rechnung',
          routerLink: './om/invoice/new/edit',
          visible: this.featureFlags.navigation.showNewInvoice
        }
      ]
    }
  ];
}
