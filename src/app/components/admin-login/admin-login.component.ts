import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LoginFormState {
  contractNumber: string;
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  @Input() formState!: LoginFormState;
  @Input() showPassword = false;
  @Input() translations: any;

  @Output() togglePassword = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}