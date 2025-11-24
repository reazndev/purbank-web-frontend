import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileDetectionService } from './shared/services/mobile-detection.service';
import { MobileWarningComponent } from './shared/mobile-warning/mobile-warning.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MobileWarningComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly mobileDetectionService = inject(MobileDetectionService);
  
  getIsMobile() {
    return this.mobileDetectionService.getIsMobile();
  }
}
