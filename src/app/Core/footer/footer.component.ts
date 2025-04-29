

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  subscribeEmail(event: Event): void {
    event.preventDefault();
  
    const input = (event.target as HTMLFormElement).querySelector('input[type="email"]') as HTMLInputElement;
  
    const email = input?.value;
  
    if (email) {
      alert(`Subscribed with email: ${email}`);
      input.value = '';
    }
  }
  

  changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLang = target.value;
    alert(`Language changed to: ${selectedLang}`);
  }
  
}
