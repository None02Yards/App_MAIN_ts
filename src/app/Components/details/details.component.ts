import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';

interface Movie {
  poster_path: string;
  title: string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mediaType: any;
  media: string = "";
  id: any;
  videoSafeURL!: any;
  castList: any[] = [];

  itemDetails: any = [];
  Trailer: string = "";
  showRow: boolean = false;
  showGenre = false;
 @ViewChild('similarSlider', { static: false }) similarSlider!: ElementRef;
similarItems: any[] = [];


showLeftArrow = false;
showRightArrow = true;


scrollSimilarLeft(): void {
  this.similarSlider.nativeElement.scrollBy({ left: -600, behavior: 'smooth' });
  setTimeout(() => this.updateArrows(), 300);
}

scrollSimilarRight(): void {
  this.similarSlider.nativeElement.scrollBy({ left: 600, behavior: 'smooth' });
  setTimeout(() => this.updateArrows(), 300);
}

updateArrows(): void {
  const el = this.similarSlider.nativeElement;
  this.showLeftArrow = el.scrollLeft > 0;
  this.showRightArrow = el.scrollLeft + el.clientWidth < el.scrollWidth;
}


  moreToExplore: {
    title: string;
    linkText: string;
    link: string;
    
    posters: Movie[];
  }[] = [
    {
      title: 'Top Trending Movies',
      linkText: 'See All',
      link: '/movies/popular/1',
      posters: []
    },
    {
      title: 'Top TV Shows',
      linkText: 'Explore TV',
      link: '/tvshows/on_the_air/1',
      posters: []
    }
  ];

  constructor(
    private _Router: Router,
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private Spinner: NgxSpinnerService
  ) {
    this._ActivatedRoute.params.subscribe(() => {
      this.mediaType = this._ActivatedRoute.snapshot.paramMap.get("mediaType");
      this.media = this.mediaType === "tv" ? "Tv show" : "Movie";
      this.id = this._ActivatedRoute.snapshot.paramMap.get("id");

      this.fetchDetails();
      this.fetchTrailer();
      this.fetchMoreToExplore();
     this.fetchSimilarItems();
     this.fetchCast();
    });
  }

  ngOnInit(): void {}

fetchSimilarItems(): void {
  this._DataService.getSimilar(this.mediaType, this.id).subscribe({
    next: (res: any) => {
      this.similarItems = res.results.filter((item: any) => item.poster_path).slice(0, 12);
    },
    error: (err) => {
      console.error('Failed to fetch similar items', err);
    }
  });
}

  fetchDetails(): void {
    this.Spinner.show();
    this._DataService.getDetails(this.mediaType, this.id).subscribe({
      next: (response) => {
        this.Spinner.hide();
        this.itemDetails = response;
this._DataService.getDetails(this.mediaType, this.id).subscribe({
  next: (res) => {
    this.castList = res.cast.filter((member: any) => member.profile_path).slice(0 ,4);
  },
  error: (err) => {
    console.error('Cast fetch failed:', err);
  }
});

        if (this.itemDetails.success === false) {
          this._Router.navigateByUrl("/notfound");
        }

        if (this.itemDetails.genres?.length) {
          this.showGenre = true;
        }
      },
      error: () => {
        this.Spinner.hide();
        this._Router.navigateByUrl("/notfound");
      }

      
    });
  }

  fetchTrailer(): void {
    this._DataService.getTrailer(this.mediaType, this.id).subscribe({
      next: (videos) => {
        if (videos.results?.[0]?.key) {
          this.Trailer = videos.results[0].key;
          this.showRow = true;
          this.videoSafeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.Trailer}?rel=0`
          );
        }
      },
      error: (err) => {
        console.error("Trailer fetch error:", err);
      }
    });
  }
    fetchCast(): void {
      this._DataService.getMediaCredits(this.mediaType, this.id).subscribe({

        next: (res) => {
          this.castList = res.cast
            .filter((member: any) => member.profile_path)
            .slice(0, 5);
        },
        error: (err) => {
          console.error('Cast fetch failed:', err);
        }
      });
    }
  fetchMoreToExplore(): void {
    this._DataService.getTrending("all").subscribe({
      next: (data) => {
        const allData = data.results.filter((item: any) => item.poster_path);
        const movies = this.shuffle(allData.filter((item: any) => item.media_type === "movie"));
        const tvs = this.shuffle(allData.filter((item: any) => item.media_type === "tv"));

        this.moreToExplore[0].posters = movies.slice(0, 3);
        this.moreToExplore[1].posters = tvs.slice(0, 3);
      },
      error: (err) => {
        console.error('MoreToExplore fetch failed:', err);
      }
    });
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  videoURL(videoSrcUrl: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoSrcUrl);
  }

  navigateTo(path: string) {
  this._Router.navigateByUrl(path);
}

}
