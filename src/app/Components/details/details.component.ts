

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';
import { WatchlistService, CustomList, WatchlistItem } from 'src/app/Services/watchlist.service';

interface Movie {
  poster_path: string;
  title?: string;
  name?: string;
}

type MT = 'movie' | 'tv';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mediaType: any;
  media = '';
  id: any;
customLists: CustomList[] = [];

  videoSafeURL!: SafeResourceUrl;
  showRow = false;

  hero = {
    key: '' as string,
    url: null as SafeResourceUrl | null,
    urlAuto: null as SafeResourceUrl | null,
    playing: false,
    loaded: false,
    bgImage: '' as string, // css background-image: url("...")
  };

  castList: any[] = [];
  itemDetails: any = [];
  Trailer = '';
  showGenre = false;

  @ViewChild('similarSlider', { static: false }) similarSlider!: ElementRef;
  similarItems: any[] = [];
  showLeftArrow = false;
  showRightArrow = true;

  moreToExplore: {
    title: string;
    linkText: string;
    link: string;
    posters: Movie[];
    type: 'movie' | 'tv';
  }[] = [
    { title: 'Top Trending Movies', linkText: 'See All', link: '/movies/popular/1', posters: [], type: 'movie' },
    { title: 'Top TV Shows',        linkText: 'Explore TV', link: '/tvshows/on_the_air/1', posters: [], type: 'tv' }
  ];



  constructor(
    private _Router: Router,
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private Spinner: NgxSpinnerService,
     private watchlist: WatchlistService

  ) {
    this._ActivatedRoute.params.subscribe(() => {
      this.mediaType = this._ActivatedRoute.snapshot.paramMap.get('mediaType');
      this.media = this.mediaType === 'tv' ? 'Tv show' : 'Movie';
      this.id = this._ActivatedRoute.snapshot.paramMap.get('id');

      this.fetchDetails();
      this.fetchTrailer();
      this.fetchMoreToExplore();
      this.fetchSimilarItems();
      this.fetchCast();
    });
  }

get wlItem(): WatchlistItem {
  const t = (this.mediaType === 'tv'
              ? 'tv'
              : this.mediaType === 'anime'
                ? 'anime'
                : 'movie') as WatchlistItem['type'];

  return {
    id: Number(this.itemDetails?.id ?? this.id),           // ensure number
    title: this.itemDetails?.title || this.itemDetails?.name || '',
    poster_path: this.itemDetails?.poster_path || '',
    type: t                                                // ✅ required by interface
  };
}


  ngOnInit(): void {

    if ((this.watchlist as any).getCustomLists) {
    this.customLists = (this.watchlist as any).getCustomLists();
  } else {
    this.customLists = [];
  }
  }

  fetchSimilarItems(): void {
    this._DataService.getSimilar(this.mediaType, this.id).subscribe({
      next: (res: any) => {
        this.similarItems = res.results.filter((item: any) => item.poster_path).slice(0, 12);
        setTimeout(() => this.updateArrows(), 0);
      },
      error: err => console.error('Failed to fetch similar items', err)
    });
  }
  scrollSimilarLeft(): void {
    this.similarSlider.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
    setTimeout(() => this.updateArrows(), 300);
  }
  scrollSimilarRight(): void {
    this.similarSlider.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
    setTimeout(() => this.updateArrows(), 300);
  }
  updateArrows(): void {
    const el = this.similarSlider?.nativeElement;
    if (!el) return;
    this.showLeftArrow = el.scrollLeft > 0;
    this.showRightArrow = el.scrollLeft + el.clientWidth < el.scrollWidth;
  }

  // ===== Details =====
  fetchDetails(): void {
    this.Spinner.show();
    this._DataService.getDetails(this.mediaType, this.id).subscribe({
      next: (response) => {
        this.Spinner.hide();
        this.itemDetails = response;

        if (this.itemDetails.success === false) {
          this._Router.navigateByUrl('/notfound');
          return;
        }
        this.showGenre = !!this.itemDetails.genres?.length;

        this.applyHeroBackdrop();
      },
      error: () => {
        this.Spinner.hide();
        this._Router.navigateByUrl('/notfound');
      }
    });
  }

  goToDetails(item: any, type: 'movie' | 'tv', event?: MouseEvent): void {
  event?.stopPropagation();
  this._Router.navigate(['/details', type, item.id]);
}

  // ===== Cast =====
  fetchCast(): void {
    this._DataService.getMediaCredits(this.mediaType, this.id).subscribe({
      next: (res) => {
        this.castList = res.cast.filter((m: any) => m.profile_path).slice(0, 5);
      },
      error: (err) => console.error('Cast fetch failed:', err)
    });
  }

  fetchTrailer(): void {
    this._DataService.getTrailer(this.mediaType, this.id).subscribe({
      next: (videos) => {
        // Pick best: an official YouTube Trailer if available
        const items = videos?.results || [];
        const preferred = items.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')
                      || items.find((v: any) => v.site === 'YouTube');
        const key = preferred?.key;

        if (!key) { this.showRow = false; return; }

        this.Trailer = key;
        this.videoSafeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${key}?rel=0`
        ); // kept for compatibility

        //  hero URLs
        const base = `https://www.youtube-nocookie.com/embed/${key}?rel=0&modestbranding=1&playsinline=1`;
        this.hero.key = key;
        this.hero.url = this.sanitizer.bypassSecurityTrustResourceUrl(base);
        this.hero.urlAuto = this.sanitizer.bypassSecurityTrustResourceUrl(base + '&autoplay=1&mute=1');
        this.showRow = true; // controls block visibility

        // Poster backdrop once details arrive
        this.applyHeroBackdrop();
      },
      error: (err) => console.error('Trailer fetch error:', err)
    });
  }

  private applyHeroBackdrop() {
    if (!this.hero.key) return;
    const backdrop = this.itemDetails?.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${this.itemDetails.backdrop_path}`
      : `https://img.youtube.com/vi/${this.hero.key}/hqdefault.jpg`;
    this.hero.bgImage = `url("${backdrop}")`;
  }

  playHero()  { this.hero.playing = true; this.hero.loaded = false; }
  stopHero()  { this.hero.playing = false; }

  fetchMoreToExplore(): void {
    this._DataService.getTrending('all').subscribe({
      next: (data) => {
        const allData = data.results.filter((item: any) => item.poster_path);
        const movies = this.shuffle(allData.filter((i: any) => i.media_type === 'movie'));
        const tvs    = this.shuffle(allData.filter((i: any) => i.media_type === 'tv'));
        this.moreToExplore[0].posters = movies.slice(0, 3);
        this.moreToExplore[1].posters = tvs.slice(0, 3);
      },
      error: (err) => console.error('MoreToExplore fetch failed:', err)
    });
  }

  shuffle(array: any[]): any[] { return array.sort(() => Math.random() - 0.5); }
  videoURL(url: any) { return this.sanitizer.bypassSecurityTrustResourceUrl(url); }
  navigateTo(path: string) { this._Router.navigateByUrl(path); }
}

