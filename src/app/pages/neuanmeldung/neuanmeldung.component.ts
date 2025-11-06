import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-neuanmeldung',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  templateUrl: './neuanmeldung.component.html',
  styleUrl: './neuanmeldung.component.css'
})
export class NeuanmeldungComponent {
}