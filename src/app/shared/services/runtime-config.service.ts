import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RuntimeConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private config: RuntimeConfig | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Load the runtime configuration from assets/config.json
   * This is called during app initialization
   */
  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(
        this.http.get<RuntimeConfig>('/assets/config.json')
      );
      console.log('Runtime configuration loaded:', this.config);
    } catch (error) {
      console.error('Failed to load runtime configuration, using defaults', error);
      // Fallback to default config if file doesn't exist (e.g., in development)
      this.config = {
        apiUrl: '/api/v1'
      };
    }
  }


  getApiUrl(): string {
    if (!this.config) {
      console.warn('Runtime config not loaded yet, using default');
      return '/api/v1';
    }
    return this.config.apiUrl;
  }


  getConfig(): RuntimeConfig | null {
    return this.config;
  }
}