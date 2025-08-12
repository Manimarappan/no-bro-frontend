import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  isDropupOpen = false;

  showDropup() {
    this.isDropupOpen = true;
  }

  hideDropup() {
    this.isDropupOpen = false;
  }

}
