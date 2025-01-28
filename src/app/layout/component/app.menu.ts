import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { featureFlags } from '../../feature-flags';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li
        app-menuitem
        *ngIf="!item.separator"
        [item]="item"
        [index]="i"
        [root]="true"
      ></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu {
  model: MenuItem[] = [];
  featureFlags = featureFlags;

  ngOnInit() {
    this.model = [
      {
        label: 'Kunden',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Übersicht',
            routerLink: './crm/overview',
            visible: this.featureFlags.navigation.showCustomerOverview,
          },
        ],
      },
      {
        label: 'Rechnungen',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Übersicht',
            routerLink: './om/invoice',
            visible: this.featureFlags.navigation.showInvoiceOverview,
          },
          {
            label: 'Neue Rechnung',
            routerLink: './om/invoice/new/edit',
            visible: this.featureFlags.navigation.showNewInvoice,
          },
        ],
      },
    ];
  }
}
