import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../shared/services/session.service';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'app-session-timeout-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-timeout-modal.component.html',
  styleUrl: './session-timeout-modal.component.css'
})
export class SessionTimeoutModalComponent {
  public readonly sessionService = inject(SessionService);
  public readonly languageService = inject(LanguageService);

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
