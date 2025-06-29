import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showMenuItem = true;
  showSearch = false;
  isCollapsed = true;

  searchQuery = '';
  searchType: 'multi' | 'person' | 'keyword' = 'multi'; // All 🔽 is default
  searchResults: any[] = [];
  showDropdown = false;
dropdownOpen = false;

isCelebsPage = false;
  isScrolled = false;
  isWelcomePage = false;
  isWatchlistPage = false;
  isMediaPage = false;
  hideNavbar = false;

  constructor(
    private _Router: Router,
    private _DataService: DataService
  ) {}

 ngOnInit(): void {
  this.updateNavbarFlags(this._Router.url);

  this._Router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event) => {
      const nav = event as NavigationEnd;
      this.updateNavbarFlags(nav.urlAfterRedirects);
    });
}

//   private updateNavbarFlags(currentUrl: string): void {
//   this.isWelcomePage = currentUrl.includes('/welcome');
//   this.isWatchlistPage = currentUrl.includes('/watchlist');
//   this.isMediaPage =
//     currentUrl.includes('/movies') ||
//     currentUrl.includes('/tvshows') ||
//     currentUrl.includes('/search') ||
//     currentUrl.includes('/home');

//   const isHomePage = currentUrl === '/' || currentUrl === '/home';
//   const isPersonDetailsPage = currentUrl.includes('/person/');

//   this.isCelebsPage = currentUrl.includes('/people') || isPersonDetailsPage;

//   this.hideNavbar = this.isWelcomePage;
//   this.showSearch = !this.isWelcomePage && !isHomePage;
//   this.showMenuItem = !this.isWelcomePage;
// }

 private updateNavbarFlags(currentUrl: string): void {
    this.isWelcomePage = currentUrl.includes('/welcome');
    this.isWatchlistPage = currentUrl.includes('/watchlist');
    this.isMediaPage = currentUrl.includes('/movies') || currentUrl.includes('/tvshows') || currentUrl.includes('/search') || currentUrl.includes('/home');

    const isHomePage = currentUrl === '/' || currentUrl === '/home';
    this.showSearch = !(this.isWelcomePage || isHomePage);
    this.showMenuItem = !this.isWelcomePage;

     const isPersonDetailsPage = currentUrl.includes('/person/');

  this.isCelebsPage = currentUrl.includes('/people') || isPersonDetailsPage;

   const isCustomListPage = currentUrl.includes('/watchlist/custom');
  const isCreateListPage = currentUrl.includes('/watchlist/create');

   this.showSearch = !(this.isWelcomePage || isHomePage) || isCustomListPage || isCreateListPage;
  this.showMenuItem = !this.isWelcomePage;

  //  Only hide on scroll for main /watchlist page, NOT its children
    this.hideNavbar = this.isWelcomePage ? true : false;


  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

hoverDropdown(isHovering: boolean) {
  this.dropdownOpen = isHovering;
}

selectSearchType(type: 'multi' | 'person' | 'keyword') {
  this.searchType = type;
  this.dropdownOpen = false;
}


getSearchLabel(type: string): string {
  switch (type) {
    case 'person': return 'Celebs';
    case 'keyword': return 'Keywords';
    default: return 'All';
  }
}

  targetInfo(event: Event | undefined): void {
    const input = event?.target as HTMLInputElement | null;
    this.searchQuery = input?.value ?? '';
  }

redirectToSearch(): void {
  const query = this.searchQuery.trim();
  if (!query) return;

  if (this.searchType === 'person') {
    this._DataService.searchByType(query, 'person').subscribe((res: any) => {
      if (!res?.results?.length) {
        this._Router.navigate(['/notfound']);
        return;
      }

      // Filter out empty results
      const validPeople = res.results.filter((person: any) =>
        person.profile_path && person.popularity > 3
      );

      // Try to find a close name match first
      const bestMatch = validPeople.find((p: any) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      ) || validPeople[0];

      if (bestMatch) {
        this._Router.navigate(['/person', bestMatch.id]);
      } else {
        this._Router.navigate(['/notfound']);
      }
    });
    return;
  }

  // For 'multi' or 'keyword' — fallback to normal search page
  this._Router.navigate(['/search'], {
    queryParams: {
      q: query,
      type: this.searchType
    }
  });

  this.searchQuery = '';
  this.searchResults = [];
  this.showDropdown = false;
}


  onSearchInput(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.searchResults = [];
      this.showDropdown = false;
      return;
    }

    this._DataService.searchMulti(query, this.searchType).subscribe((res: any) => {
      this.searchResults = res.results?.slice(0, 6) || [];
      this.showDropdown = this.searchResults.length > 0;
    });
  }

goToResult(item: any): void {
  this.searchResults = [];
  this.showDropdown = false;

  if (item.media_type === 'person') {
    this._Router.navigate(['/person', item.id]); 
  } else if (item.media_type === 'movie' || item.media_type === 'tv') {
    this._Router.navigate(['/details', item.media_type, item.id]);
  } else if (this.searchType === 'keyword') {
    this._Router.navigate(['/search'], {
      queryParams: { keyword: item.name }
    });
  }
}


  navigateWithFragment(fragment: string): void {
    const targetUrl = '/home';
    if (this._Router.url.startsWith(targetUrl)) {
      this.scrollToElement(fragment);
    } else {
      this._Router.navigate([targetUrl], { fragment }).then(() => {
        setTimeout(() => this.scrollToElement(fragment), 100);
      });
    }
  }

  private scrollToElement(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

@HostListener('window:scroll', [])
onWindowScroll(): void {
    const scrollY = window.scrollY || window.pageYOffset;
  const currentUrl = this._Router.url;

  const isMainWatchlist = currentUrl === '/watchlist';
  const isCustomListPage = currentUrl.includes('/watchlist/custom');
  const isCreateListPage = currentUrl.includes('/watchlist/create');

  if (this._Router.url.includes('/watchlist')) {
    this.hideNavbar = scrollY > 100;
    return;
  }

  if (
    this._Router.url.includes('/tvshows') ||
    this._Router.url.includes('/people') ||
    this._Router.url.includes('/movies') ||
    this._Router.url.includes('/search') ||
    this._Router.url.includes('/person/')
  ) {
    this.isScrolled = true;
    this.showSearch = true;
  } else {
    const heroHeight = 500;
    this.isScrolled = scrollY > heroHeight;
    this.showSearch = this.isScrolled;
  }
}
}