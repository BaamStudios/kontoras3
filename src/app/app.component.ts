import { CommonModule } from '@angular/common';
import {} from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './pages/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(@Inject(AuthService) public authService: AuthService) {}

  title = 'kontoras3';
}
