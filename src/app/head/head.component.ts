import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClrDropdownModule, ClrIconModule } from '@clr/angular';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { remult } from 'remult';

@Component({
    selector: 'app-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss'],
    imports: [ClrDropdownModule, ClrIconModule, CommonModule]
})
export class HeadComponent {
  remult = remult; // Define remult property

  constructor(public authService: AuthService, private translate: TranslateService) {}

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    this.authService.logOut();
  }
}
