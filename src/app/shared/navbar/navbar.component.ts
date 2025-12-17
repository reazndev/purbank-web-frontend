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
    this.userService.getUsers().subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          this.currentUser = users[0]; // Get first user (current logged in user)
        }
      },
      error: (error) => {
        console.error('Error loading user:', error);
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