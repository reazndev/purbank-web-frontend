import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  templateUrl: './showcase.page.html',
  styleUrls: ['./showcase.page.css']
})
export class ShowcasePage {
  private readonly languageService = inject(LanguageService);
  translations = computed(() => this.languageService.getTranslations());
  
  screenshots = [
    { src: 'showcase-assets/dashboard.png', alt: 'User Dashboard' },
    { src: 'showcase-assets/wealth.png', alt: 'Wealth Overview' },
    { src: 'showcase-assets/payments.png', alt: 'Payment Interface' },
    { src: 'showcase-assets/transactions.png', alt: 'Transaction History' },
    { src: 'showcase-assets/admin-dashboard.png', alt: 'Admin Dashboard' },
    { src: 'showcase-assets/admin-audit-log.png', alt: 'Admin Audit Log' }
  ];

  diagrams = [
    { src: 'showcase-assets/ERM-diagram.png', alt: 'ERM Diagram' },
    { src: 'showcase-assets/login-flow.png', alt: 'Login Flow' },
    { src: 'showcase-assets/setup-flow.png', alt: 'System Setup Flow' }
  ];

  bigVideo = { src: 'showcase-assets/showcase-gesamt.mp4', title: 'Purbank Full System Showcase' };

  authors = [
    { name: 'David Koteski', portfolio: 'https://koteski.ch' },
    { name: 'Lukas Hilfiker', portfolio: 'https://lukas.hilfiker.dev/' },
    { name: 'Milan Jankovic', portfolio: '#' },
    { name: 'Florian Ruby', portfolio: '#' }
  ];

  repositories = [
    { name: 'Backend', url: 'https://github.com/reazndev/purbank-backend' },
    { name: 'Mobile App', url: 'https://github.com/reazndev/purbank-mobile-app' },
    { name: 'Web Frontend', url: 'https://github.com/reazndev/purbank-web-frontend' },
    { name: 'Meta', url: 'https://github.com/reazndev/purbank-meta' }
  ];

  videos = [
    { src: 'showcase-assets/konto-management.mp4', title: 'Account Management' },
    { src: 'showcase-assets/create-transaction.mp4', title: 'Transaction Flow' }
  ];

  constructor() {}

  selectedImage: string | null = null;

  openImage(src: string): void {
    this.selectedImage = src;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeImage(): void {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }
}
