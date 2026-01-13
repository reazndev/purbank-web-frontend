import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeCH from '@angular/common/locales/de-CH';

import { routes } from './app.routes';
import { authInterceptor } from './shared/services/auth.interceptor';
import { RuntimeConfigService } from './shared/services/runtime-config.service';

registerLocaleData(localeCH);

export function initializeApp(runtimeConfigService: RuntimeConfigService) {
  return () => runtimeConfigService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'de-CH' },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [RuntimeConfigService],
      multi: true
    }
  ]
};