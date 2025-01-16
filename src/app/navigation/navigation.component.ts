import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  ClrIconModule,
  ClrNavigationModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { featureFlags } from '../feature-flags';

@Component({
    selector: 'app-navigation',
    imports: [
        CommonModule,
        ClrNavigationModule,
        ClrIconModule,
        RouterLink,
        RouterLinkActive,
        ClrVerticalNavModule,
        RouterOutlet,
        TranslateModule
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  demoCollapsible = false;
  featureFlags = featureFlags;
}
