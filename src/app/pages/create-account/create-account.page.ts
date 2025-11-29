import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LanguageService } from '../../shared/services/language.service';
import { LanguageToggleComponent } from '../../shared/language-toggle/language-toggle.component';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [RouterModule, FooterComponent, LanguageToggleComponent],
  templateUrl: './create-account.page.html',
  styleUrl: './create-account.page.css'
})
export class CreateAccountPage {
  private readonly languageService = inject(LanguageService);
  
  translations = computed(() => this.languageService.getTranslations());
}