

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-footer',
//   templateUrl: './footer.component.html',
//   styleUrls: ['./footer.component.scss']
// })


// export class FooterComponent {

//   currentLang: string = 'English';
//   isOpen = false;
//   currentYear: number = new Date().getFullYear();
//   subscribeEmail(event: Event): void {
//     event.preventDefault();
  
//     const input = (event.target as HTMLFormElement).querySelector('input[type="email"]') as HTMLInputElement;
  
//     const email = input?.value;
  
//     if (email) {
//       alert(`Subscribed with email: ${email}`);
//       input.value = '';
//     }

//     toggleDropdown() {
//       this.isOpen = !this.isOpen;
//     }
  
//     setLanguage(lang: string) {
//       this.currentLang = lang;
//       this.isOpen = false;
  
//       // Optional: Trigger any language switch logic here (e.g., ngx-translate)
//       alert(`Language changed to: ${lang}`);
//     }
//   }
  

//   changeLanguage(event: Event): void {
//     const target = event.target as HTMLSelectElement;
//     const selectedLang = target.value;
//     alert(`Language changed to: ${selectedLang}`);
//   }
  
// }


import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  currentLang: string = 'EN';
  isOpen: boolean = false;
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

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  // Set selected language
  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.isOpen = false; 

    
    alert(`Language changed to: ${lang}`);
  }

  // Change language via select input
  changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLang = target.value;
    alert(`Language changed to: ${selectedLang}`);
  }
}
