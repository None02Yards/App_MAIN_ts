import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})


export class AppComponent {
  showArrow = false;
  isAtTop = true;
  currentRoute = '';
 hideSidebar = false;
  
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
          this.hideSidebar = this.currentRoute === '/welcome';

        setTimeout(() => this.checkScroll(), 100);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const currentUrl = this.currentRoute;
    const heroHeight = 700;

    if (
      currentUrl.includes('/tvshows') ||
      currentUrl.includes('/movies') ||
      currentUrl.includes('/people')
    ) {
      this.showArrow = true;
      this.isAtTop = scrollY < 200;
      return;
    }

    if (currentUrl === '/welcome') {
      this.showArrow = false;
      return;
    }

    //  only if scrolled past hero
    this.isAtTop = scrollY < heroHeight;
    this.showArrow = scrollY > heroHeight;
  }

  handleScroll(): void {
    const scrollTarget = this.isAtTop ? 1000 : 0;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  }
}

