import { Routes } from '@angular/router';
import { authGuard } from '../pages/auth/auth.guard';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CompanyViewComponent } from './company-view/company-view.component';
import { CrmComponent } from './crm.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { PersonViewComponent } from './person-view/person-view.component';

export default [
  {
    path: 'overview',
    canActivate: [authGuard],
    component: CrmComponent,
  },
  {
    path: 'person/:id',
    canActivate: [authGuard],
    component: PersonViewComponent,
  },
  {
    path: 'person/:id/edit',
    canActivate: [authGuard],
    component: PersonEditComponent,
  },
  {
    path: 'company/:id',
    canActivate: [authGuard],
    component: CompanyViewComponent,
  },
  {
    path: 'company/:id/edit',
    canActivate: [authGuard],
    component: CompanyEditComponent,
  },
] as Routes;
