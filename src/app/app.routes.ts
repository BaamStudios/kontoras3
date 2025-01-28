import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Landing } from './pages/landing/landing';
import { Notfound } from './pages/notfound/notfound';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        redirectTo: 'crm/overview',
        pathMatch: 'full',
      },
      { path: 'crm', canActivate: [authGuard], canActivateChild: [authGuard], loadChildren: () => import('./crm/crm.routes') },
      { path: 'om', canActivate: [authGuard], canActivateChild: [authGuard], loadChildren: () => import('./om/om.routes') },
      {
        path: 'settings', canActivate: [authGuard], canActivateChild: [authGuard],
        loadChildren: () => import('./settings/settings.routes'),
      },
    ],
  },
  { path: 'landing', component: Landing },
  { path: 'notfound', component: Notfound },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
  { path: '**', redirectTo: '/notfound' },
];

// export const routes: Routes = [

//   {
//     path: 'login',
//     component: AuthComponent,
//   },
// ];
