import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { remult } from 'remult';
import { AuthService } from '../auth/auth.service';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'app-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss'],
    imports: [MenuModule, CommonModule, BadgeModule, AvatarModule, InputTextModule, Ripple, MenubarModule,  ]
})
export class HeadComponent {
  remult = remult; // Define remult property
  items: MenuItem[]; // Define items property

  constructor(public authService: AuthService, private translate: TranslateService) {
    this.items = [
      {
        label: remult.user?.name,
        icon: 'pi pi-user',
        items: []
      },
      {
        label: '',
        icon: 'pi pi-globe',
        items: [
          { label: 'Deutsch', command: () => this.changeLanguage('de') },
          { label: 'English', command: () => this.changeLanguage('en') }
        ]
      },
      {
        label: '',
        icon: 'pi pi-cog',
        items: [
          { label: 'Über', routerLink: '/about' },
          { label: 'Nummernkreise', routerLink: '/settings/number-ranges' },
          { label: 'Ausloggen', command: () => this.logout() }
        ]
      }
    ];
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    this.authService.logOut();
  }
}
