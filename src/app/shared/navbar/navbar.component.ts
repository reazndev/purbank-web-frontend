import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService, Language } from '../services/language.service';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  
  currentLanguage = this.languageService.getCurrentLanguage();
  translations = computed(() => this.languageService.getTranslations());
  currentUser: User | null = null;

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  isLanguageActive(language: Language): boolean {
    return this.currentLanguage() === language;
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}