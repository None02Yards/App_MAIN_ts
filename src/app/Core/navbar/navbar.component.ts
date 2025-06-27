import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showMenuItem: boolean = true;
  target: string = "";
  isScrolled: boolean = false;
  showSearch: boolean = false;
  isWatchlistPage: boolean = false;
  hideNavbar: boolean = false;
  isWelcomePage: boolean = false;
  isMediaPage: boolean = false;
  isCollapsed = true;

  constructor(private _Router: Router) {}

  ngOnInit(): void {
    const initialUrl = this._Router.url;
    this.isWelcomePage = initialUrl.includes('/welcome');
    const isHomePage = initialUrl === '/' || initialUrl === '/home';

    this.showSearch = !(this.isWelcomePage || isHomePage);
    this.showMenuItem = !this.isWelcomePage;

    this._Router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navigation = event as NavigationEnd;
        const currentUrl = navigation.urlAfterRedirects || navigation.url;

        this.isMediaPage = currentUrl.includes('/movies') || currentUrl.includes('/tvshows') || currentUrl.includes('/search') || currentUrl.includes('/home');
        const isHomePage = currentUrl === '/' || currentUrl === '/home';
        this.isWelcomePage = currentUrl.includes('/welcome');
        this.isWatchlistPage = currentUrl.includes('/watchlist');

        const shouldHideSearch = this.isWelcomePage || isHomePage;
        this.showMenuItem = !this.isWelcomePage;
      });
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  targetInfo(eventInfo: any) {
    this.target = eventInfo.target.value;
  }

  redirectToSearch() {
    if (this.target && this.target.trim() !== '') {
      this._Router.navigate(['/search', this.target]);
    }
  }

 navigateWithFragment(fragment: string): void {
  const targetUrl = '/home';

  if (this._Router.url.startsWith(targetUrl)) {
    this.scrollToElement(fragment);
  } else {
    this._Router.navigate([targetUrl], { fragment }).then(() => {
      setTimeout(() => this.scrollToElement(fragment), 100); // Delay for DOM load
    });
  }
}

private scrollToElement(fragment: string) {
  const element = document.getElementById(fragment);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentUrl = this._Router.url;

    if (currentUrl.includes('/watchlist')) {
      const scrollY = window.scrollY || window.pageYOffset;
      this.hideNavbar = scrollY > 100;
      return;
    }

    if (
      currentUrl.includes('/tvshows') ||
      currentUrl.includes('/people') ||
      currentUrl.includes('/movies') ||
      currentUrl.includes('/person-details') ||
      currentUrl.includes('/search')
    ) {
      this.isScrolled = true;
      this.showSearch = true;
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = 500;
    this.isScrolled = scrollY > heroHeight;
    this.showSearch = this.isScrolled;
  }
}
