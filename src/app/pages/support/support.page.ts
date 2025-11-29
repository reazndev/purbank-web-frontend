import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LanguageService } from '../../shared/services/language.service';
import { LanguageToggleComponent } from '../../shared/language-toggle/language-toggle.component';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [RouterModule, FooterComponent, LanguageToggleComponent],
  templateUrl: './support.page.html',
  styleUrl: './support.page.css'
})
export class SupportPage {
  private readonly languageService = inject(LanguageService);
  
  translations = computed(() => this.languageService.getTranslations());
}