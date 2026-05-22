import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LangDefinition, TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { AppStorageService } from '../../../common/services/app-storage.service';

@Component({
  selector: 'app-loan-simulator-layout',
  imports: [
    RouterModule,
    TranslocoPipe,
],
  templateUrl: './loan-simulator-layout.component.html',
  styleUrl: './loan-simulator-layout.component.scss'
})
export class LoanSimulatorLayoutComponent {
    private readonly translocoService = inject(TranslocoService);
    private readonly appStorageService = inject(AppStorageService);

    public languages = computed(() => this.translocoService.getAvailableLangs() as string[]);

    public translate(language: string) {
        this.translocoService.setActiveLang(language);
        this.appStorageService.set('lang', language);
    }
}
