

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from 'src/app/Services/data.service';
import { filter } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ NEW

type MT = 'movie' | 'tv'; // ✅ NEW
interface TrailerClip {   // ✅ NEW
  id: number;
  mediaType: MT;
  title: string;
  poster: string | null;
  key: string;
  url: SafeResourceUrl;      // normal
  urlAuto: SafeResourceUrl;  // autoplay
  playing?: boolean;
}

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {

  page:number=0
  personData:any=[]
  knownFor:any[]=[]
  moreToExploreCelebs: any[] = [];
  id:any;
  profileSrc:string = "";
  Src:any=[]
  showFullBio = false;
  personId: string = '';
  roles: string[] = []

  // ✅ Trailers state
  trailers: TrailerClip[] = [];
  loadingTrailers = false;

  constructor(
    private _Router:Router,
    private _DataService:DataService,
    private _ActivatedRoute:ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,         // ✅ NEW
  ) {
    // You can keep this initial load or rely only on loadPerson(); either way we also call trailers loader.
    this.id = _ActivatedRoute.snapshot.paramMap.get("id");

    _DataService.getDetails("person", this.id).subscribe((response)=>{
      this.personData = response;
      this.profileSrc = `https://image.tmdb.org/t/p/original/${this.personData.profile_path}`
    });

    _DataService.getCredits(this.id).subscribe((data)=>{
      this.knownFor = (data.cast || []).filter((item:any)=> item.poster_path != null);
      this.loadKnownForTrailers(); // ✅ fetch trailers after knownFor arrives
    });
  }

  ngOnInit(): void {
    this.getMoreToExploreCelebs();
    this.loadPerson();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadPerson();
      });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0:   { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: true
  }

  goBack(): void { history.back(); }

  loadPerson(): void {
    this.personId = this._ActivatedRoute.snapshot.paramMap.get('id')!;

    this._DataService.getDetails("person", this.personId).subscribe((response) => {
      this.personData = response;
      this.profileSrc = `https://image.tmdb.org/t/p/original/${this.personData.profile_path}`;
    });

    this._DataService.getCredits(this.personId).subscribe((data) => {
      this.knownFor = (data.cast || []).filter((item: any) => item.poster_path != null);
      this.loadKnownForTrailers(); // ✅ refresh trailers on route change
    });

    this._DataService.getCombinedCredits(this.personId).subscribe((data) => {
      const hasActing = data.cast && data.cast.length > 0;
      const crewJobs = data.crew?.map((c: any) => c.job);
      const uniqueJobs = new Set(crewJobs);

      this.roles = [];
      if (hasActing) this.roles.push("Actor");
      if (uniqueJobs.has("Writer")) this.roles.push("Writer");
      if (uniqueJobs.has("Director")) this.roles.push("Director");
      if (uniqueJobs.has("Producer")) this.roles.push("Producer");
    });
  }

  getMoreToExploreCelebs(): void {
    this._DataService.getPeople(1).subscribe((res: any) => {
      const allCelebs = res.results;
      this.moreToExploreCelebs = this.getRandomItems(allCelebs, 3);
    });
  }

  getRandomItems(array: any[], count: number): any[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  get formattedBio(): string[] {
    if (!this.personData?.biography) return [];
    return this.personData.biography
      .split('. ')
      .map((sentence: string) => sentence.trim())
      .filter((sentence: string) => sentence.length > 0)
      .map((sentence: string) => (sentence.endsWith('.') ? sentence : sentence + '.'));
  }

  get visibleBio(): string[] {
    return this.showFullBio ? this.formattedBio : this.formattedBio.slice(0, 3);
  }

  toggleBio(): void { this.showFullBio = !this.showFullBio; }

  // ===============  TRAILERS (NEW)  ===============

  /** Build trailers from current `knownFor` (top N by popularity). */
  async loadKnownForTrailers(limit = 8) {
    if (!this.knownFor?.length) { this.trailers = []; return; }

    this.loadingTrailers = true;
    // reset old list so UI updates quickly on route change
    this.trailers = [];

    // prefer high-popularity items
    const pool = [...this.knownFor]
      .filter(x => !!x.id)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);

    const results = await Promise.all(
      pool.map(async it => {
        const mediaType: MT = it.media_type === 'tv' ? 'tv' : 'movie';
        const key = await this._DataService.getYoutubeTrailerKey(it.id, this._DataService.APIKey, mediaType);
        return { it, key, mediaType };
      })
    );

    this.trailers = results
      .filter(r => !!r.key)
      .map(({ it, key, mediaType }) => {
        const base = `https://www.youtube-nocookie.com/embed/${key}?rel=0&modestbranding=1&playsinline=1`;
        return {
          id: it.id,
          mediaType,
          title: it.title || it.name,
          poster: it.backdrop_path || it.poster_path || null,
          key: key as string,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(base),
          urlAuto: this.sanitizer.bypassSecurityTrustResourceUrl(base + '&autoplay=1&mute=1'),
          playing: false
        } as TrailerClip;
      });

    this.loadingTrailers = false;
  }

  playTrailer(clip: TrailerClip)  { clip.playing = true; }
  stopTrailer(clip: TrailerClip)  { clip.playing = false; }
  trackById = (_: number, x: { id: number }) => x.id;
}
