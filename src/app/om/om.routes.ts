import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { OmComponent } from './om.component';

export default [
   {
    path: 'invoice',
    canActivate: [authGuard],
    component: OmComponent,
  },
  {
    path: 'invoice/:id',
    canActivate: [authGuard],
    component: InvoiceViewComponent,
  },
  {
    path: 'invoice/:id/edit',
    canActivate: [authGuard],
    component: InvoiceEditComponent,
  }
] as Routes;
