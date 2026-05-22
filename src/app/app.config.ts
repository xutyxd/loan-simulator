import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@ngneat/transloco';
import { AppStorageService } from './common/services/app-storage.service';
import { filter, firstValueFrom } from 'rxjs';

const availableLangs = ['en', 'es'];
const language = navigator.language.split('-')[0];
const defaultLang = availableLangs.includes(language) ? language : 'en';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        provideHttpClient(),
        provideTransloco({
            config: {
                availableLangs,
                defaultLang,
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader
        }),
        provideAppInitializer(async () => {
            const appStorageService = inject(AppStorageService);
            const translocoService = inject(TranslocoService);

            let lang = appStorageService.get<string>('lang');

            if (!lang) {
                lang = navigator.language.split('-')[0];
                appStorageService.set('lang', lang);
            }

            translocoService.setActiveLang(lang);
            await firstValueFrom(translocoService.load(`${lang}`));
        }),
    ]
};
