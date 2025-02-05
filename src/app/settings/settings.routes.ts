import { Routes } from '@angular/router';
import { authGuard } from '../pages/auth/auth.guard';
import { NumberRangesComponent } from './number-ranges.component';
import { CompanySettingsComponent } from './company-settings.component';

export default [
  {
    path: 'number-ranges',
    canActivate: [authGuard],
    component: NumberRangesComponent,
  },
  {
    path: 'company-settings',
    canActivate: [authGuard],
    component: CompanySettingsComponent,
  },
] as Routes;
