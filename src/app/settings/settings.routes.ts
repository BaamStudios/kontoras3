import { Routes } from '@angular/router';
import { authGuard } from '../pages/auth/auth.guard';
import { NumberRangesComponent } from './number-ranges.component';

export default [
  {
    path: 'number-ranges',
    canActivate: [authGuard],
    component: NumberRangesComponent,
  },
] as Routes;
