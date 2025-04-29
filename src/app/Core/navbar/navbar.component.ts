
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

  constructor(private _Router: Router) {}

  ngOnInit(): void {
    this._Router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => { // No typing here
        const navigation = event as NavigationEnd; // 👉 cast inside safely
        const currentUrl = navigation.urlAfterRedirects || navigation.url; // 👉 real URL string
  
        this.isWatchlistPage = currentUrl.includes('/watchlist');
        this.isWelcomePage = currentUrl.includes('/welcome');
  
        this.showMenuItem = !this.isWelcomePage;
        this.showSearch = !this.isWelcomePage;
      });
  }
  

  targetInfo(eventInfo: any) {
    this.target = eventInfo.target.value;
  }

  redirectToSearch() {
    if (this.target && this.target.trim() !== '') {
      this._Router.navigate(['/search', this.target]);
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

    if (currentUrl.includes('/tvshows') || currentUrl.includes('/people') || currentUrl.includes('/movies') || currentUrl.includes('/person-details')) {
      this.isScrolled = true;
      this.showSearch = true;
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = 700;
    this.isScrolled = scrollY > heroHeight;
    this.showSearch = this.isScrolled;
  }
}
