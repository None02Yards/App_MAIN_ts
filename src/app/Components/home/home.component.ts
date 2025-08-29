
import { Component, ElementRef, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { CustomList, WatchlistService } from 'src/app/Services/watchlist.service';
import { Subscription } from 'rxjs';

interface Movie {
  poster_path: string;
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() trendingMovies: any[] = [];
  @Input() topTenMovies: any[] = [];
  @Input() quote: string = '';
  @Input() quoteGradient: string = '';
  @Input() customLists: CustomList[] = [];

  @Input() isKidsLayout: boolean = false;
  @Input() sliderData: any[] = [];

  @Input() moreToExplore: {
    title: string;
    linkText: string;
    link: string;
    posters: Movie[];
  }[] = [
    {
      title: 'Staff Picks: What to Watch',
      linkText: 'See our picks',
      link: '#',
      posters: []
    },
    {
      title: 'Everything New on Netflix',
      linkText: 'See the list',
      link: '#',
      posters: []
    },
    {
      title: 'Movies That Make Us Love L.A.',
      linkText: 'Vote now',
      link: '#',
      posters: []
    }
  ];

  @Input() exclusiveVideos: {
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    key: string;
  }[] = [];

  @Input() redirectToPopularTVShowsFn!: () => void;

  allData: any[] = [];
  trendingShows: any[] = [];
  news: any[] = [];

  @ViewChild('movieSlider', { static: false }) movieSlider!: ElementRef;
  @ViewChild('topTenSlider', { static: false }) topTenSlider!: ElementRef;
  private topTenScrollPos = 0;

  /** 🔗 set by WatchlistService.openMenu / closeMenu */
  overlayOpen = false;
  private menuSub?: Subscription;

  constructor(
    private _DataService: DataService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private watchlist: WatchlistService   // 👈 subscribe to global menu state
  ) {}

  ngOnInit(): void {
    // listen for the floating menu visibility
    this.menuSub = this.watchlist.menuState$.subscribe(s => {
      this.overlayOpen = !!s;
    });

    if (!this.isKidsLayout) {
      this.fetchTrendingData();
      this.fetchNews();
      return;
    }

    // kids-only auto-scroll
    setInterval(() => this.scrollRight(), 3000);
    setInterval(() => this.scrollTopTenRight(), 3000);
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();
  }

  fetchTrendingData(): void {
    this.spinner.show();

    this._DataService.getTrending('all').subscribe({
      next: (data) => {
        this.spinner.hide();

        this.allData = data.results.filter((item: any) => item.poster_path != null);

        const movies = this.shuffle(this.allData.filter((item: any) => item.media_type === 'movie'));
        const shows  = this.shuffle(this.allData.filter((item: any) => item.media_type === 'tv'));

        this.trendingMovies = movies;
        this.trendingShows  = shows;

        this.moreToExplore[0].posters = movies.slice(0, 4);
        this.moreToExplore[1].posters = shows.slice(0, 8);
        this.moreToExplore[2].posters = movies.slice(8, 12);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error fetching trending (all):', err);
      }
    });

    this._DataService.getTrending('tv').subscribe({
      next: (tvRes) => {
        const validTv = tvRes.results.filter((show: any) => show.poster_path);
        this.topTenMovies = this.shuffle(validTv).slice(0, 18);
      },
      error: (err) => console.error('Error fetching trending (tv):', err)
    });
  }

  goToPopularTVShows(event?: MouseEvent) {
    // if the overlay is open, do nothing
    if (this.overlayOpen) {
      event?.stopPropagation();
      return;
    }

    if (event) {
      const target = event.target as HTMLElement;

      // ignore clicks that originate on the watchlist icon or dropdowns
      const insideWatchlist =
        !!target.closest('.watchlist-icon-container') ||
        !!target.closest('.spotify-dropdown') ||
        !!target.closest('.submenu-dropdown');

      if (insideWatchlist) {
        event.stopPropagation();
        return;
      }
    }

    // ✅ Safe to navigate: use the callback if provided, else default route
    if (this.redirectToPopularTVShowsFn) {
      this.redirectToPopularTVShowsFn();
    } else {
      this.router.navigate(['/tvshows/popular', 1]);
    }
  }

  fetchNews(): void {
    this._DataService.getEntertainmentNews().subscribe({
      next: (data) => {
        this.news = data.articles.slice(0, 6);
      },
      error: (err) => {
        console.error('Error fetching entertainment news:', err);
      }
    });
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  scrollLeft(): void {
    this.movieSlider.nativeElement.scrollBy({ left: -800, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.movieSlider.nativeElement.scrollBy({ left: 800, behavior: 'smooth' });
  }

  scrollTopTenRight(): void {
    if (!this.topTenSlider) return;

    const container = this.topTenSlider.nativeElement;
    const cardWidth = 180 + 16;
    const scrollStep = cardWidth * 6;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    this.topTenScrollPos += scrollStep;

    if (this.topTenScrollPos >= maxScrollLeft) {
      this.topTenScrollPos = 0;
    }

    container.scrollTo({
      left: this.topTenScrollPos,
      behavior: 'smooth'
    });
  }
}
