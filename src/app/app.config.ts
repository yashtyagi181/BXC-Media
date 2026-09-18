import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // ✅ Goes to top on new pages
        anchorScrolling: 'enabled'
      })
    ),
    importProvidersFrom(LucideAngularModule.pick({ Menu, X })),
    
  ]
};
