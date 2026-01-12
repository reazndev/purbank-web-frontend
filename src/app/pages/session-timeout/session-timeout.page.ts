import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'app-session-timeout-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './session-timeout.page.html',
  styleUrl: './session-timeout.page.css'
})
export class SessionTimeoutPage {
  public readonly languageService = inject(LanguageService);
}
