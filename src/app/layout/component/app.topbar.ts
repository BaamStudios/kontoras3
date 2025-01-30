import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../pages/auth/auth.service';
import { remult } from 'remult';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, Menubar],
  template: ` <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action"
        (click)="layoutService.onMenuToggle()"
      >
        <i class="pi pi-bars"></i>
      </button>
      <a class="layout-topbar-logo" routerLink="/">
        <img src="assets/kontoras3.png" alt="Kontoras 3" height="40px" />
        <span>KONTORAS 3</span>
      </a>
    </div>
    <p-menubar id="profileMenu" #menu [model]="items" />
    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button
          type="button"
          class="layout-topbar-action"
          (click)="toggleDarkMode()"
        >
          <i
            [ngClass]="{
              'pi ': true,
              'pi-moon': layoutService.isDarkTheme(),
              'pi-sun': !layoutService.isDarkTheme()
            }"
          ></i>
        </button>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        pStyleClass="@next"
        enterFromClass="hidden"
        enterActiveClass="animate-scalein"
        leaveToClass="hidden"
        leaveActiveClass="animate-fadeout"
        [hideOnOutsideClick]="true"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> -->

          <button
            type="button"
            class="layout-topbar-action"
            (click)="this.logout()"
          >
            <i class="pi pi-sign-out"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  </div>`,
})
export class AppTopbar {
  remult = remult;
  items: MenuItem[] = [
    {
      label: remult.user?.name,
      icon: 'pi pi-user',
      items: [],
    },
    {
      label: '',
      icon: 'pi pi-globe',
      items: [
        { label: 'Deutsch', command: () => this.changeLanguage('de') },
        { label: 'English', command: () => this.changeLanguage('en') },
      ],
    },
    {
      label: '',
      icon: 'pi pi-cog',
      items: [
        { label: 'Nummernkreise', routerLink: '/settings/number-ranges' },
      ],
    },
  ];

  constructor(
    public layoutService: LayoutService,
    public authService: AuthService,
    private translate: TranslateService
  ) {}
  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  logout() {
    this.authService.logOut();
  }
}
