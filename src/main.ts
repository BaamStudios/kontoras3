import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app/app.translate-loader';
import './icons';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: TranslateModule,
      useFactory: HttpLoaderFactory,
      deps: []
    },
    appConfig.providers,
    provideHttpClient()
  ],
}).catch((err) =>
  console.error(err)
);
