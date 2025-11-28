import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
})
export class ComponentWealthSettings {
  constructor(public languageService: LanguageService) {}
}