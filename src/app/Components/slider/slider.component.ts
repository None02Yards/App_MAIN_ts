
// // slider.ts
// import { Component, OnInit } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { delay } from 'rxjs/internal/operators/delay';
// import { DataService } from 'src/app/Services/data.service';

// @Component({
//   selector: 'app-slider',
//   templateUrl: './slider.component.html',
//   styleUrls: ['./slider.component.scss'] ,
//   animations: [
//     trigger('fade',
//      [
//       transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
//       transition('* => void', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]),
//     ])
//   ]
// })

// export class SliderComponent implements OnInit {

//   current = 0;

//   movies_data: any;

//   tv_shows: any;

//   genreMap: { [key: number]: string } = {}; 


//   constructor(
//     private movieService: DataService,
//   ) { }

//   ngOnInit() {
//     this.getnowPlayingMovies(1);
//     this.getGenres();
//     this.sliderTimer();
//   }

//   getGenres() {
//     this.movieService.getMovieGenres().subscribe((res: any) => {
//       for (let genre of res.genres) {
//         this.genreMap[genre.id] = genre.name;
//       }
//     });
//   }
  

//   getnowPlayingMovies(page: number) {
//     this.movieService.getNowPlaying(page).pipe(delay(2000)).subscribe((res: any) => {
//       this.movies_data = res.results;
//     });
//   }

//   sliderTimer() {
//     setInterval(() => {
//       this.current = ++this.current % this.movies_data.length;
//     }, 7000);
//   }

// }

// //sliderComponent
// import { Component, OnInit, Input } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { delay } from 'rxjs/internal/operators/delay';
// import { DataService } from 'src/app/Services/data.service';

// @Component({
//   selector: 'app-slider',
//   templateUrl: './slider.component.html',
//   styleUrls: ['./slider.component.scss'],
//   animations: [
//     trigger('fade', [
//       transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
//       transition('* => void', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]),
//     ])
//   ]
// })

// export class SliderComponent implements OnInit {
//  @Input() movies_data: any[] = [];
//   @Input() slider: any[] = []; 
//     @Input() isKidsLayout = false;

//   current = 0;
//   tv_shows: any;
//   genreMap: { [key: number]: string } = {}; 

//   constructor(private movieService: DataService) {}

//   ngOnInit() {

//      this.loadGenres();
//     this.loadSlides();
//     this.startTimer();
//     this.getGenres();

//     // fallback only if no input provided
//     if (!this.slider.length) {
//       this.getnowPlayingMovies(1);
//     }

//     this.sliderTimer();
//   }
//   private loadGenres() {
//     this.movieService.getMovieGenres().subscribe((res: any) => {
//       for (let g of res.genres) this.genreMap[g.id] = g.name;
//     });
//   }

//  private loadSlides() {
//     if (this.slider.length){
//         return;
//     }

//   }

//  private startTimer() {
//     setInterval(() => {
//       if (this.slider.length) {
//         this.current = (this.current + 1) % this.slider.length;
//       }
//     }, 7000);
//   }


//     sliderTimer() {
//       setInterval(() => {
//         if (this.slider.length > 0) {
//           this.current = ++this.current % this.slider.length;
//         }
//       }, 7000);
//     }

//   getGenres() {
//     this.movieService.getMovieGenres().subscribe((res: any) => {
//       for (let genre of res.genres) {
//         this.genreMap[genre.id] = genre.name;
//       }
//     });
//   }

//   getnowPlayingMovies(page: number) {
//     this.movieService.getNowPlaying(page).pipe(delay(2000)).subscribe((res: any) => {
//       this.movies_data = res.results;
//     });
//   }

// }

// import { Component, OnInit, Input } from '@angular/core';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { delay } from 'rxjs/internal/operators/delay';
// import { DataService } from 'src/app/Services/data.service';
// import { KidsDataService } from 'src/app/Services/kids-data.service'; // add this line

// @Component({
//   selector: 'app-slider',
//   templateUrl: './slider.component.html',
//   styleUrls: ['./slider.component.scss'],
//   animations: [
//     trigger('fade', [
//       transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
//       transition('* => void', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]),
//     ])
//   ]
// })

// export class SliderComponent implements OnInit {
//   @Input() movies_data: any[] = [];
//   @Input() slider: any[] = [];
//   @Input() isKidsLayout = false;

//   current = 0;
//   tv_shows: any;
//   genreMap: { [key: number]: string } = {};

//   constructor(
//     private movieService: DataService,
//     private kidsService: KidsDataService    // add this line
//   ) {}

//   ngOnInit() {
//     this.loadGenres();
//     this.loadSlides();
//     this.startTimer();
//     this.getGenres();

//     // Only fallback if no input provided AND NOT in kids layout
//     if (!this.slider.length && !this.isKidsLayout) {
//       this.getnowPlayingMovies(1);
//     }

//     this.sliderTimer();
//   }

//   private loadGenres() {
//     this.movieService.getMovieGenres().subscribe((res: any) => {
//       for (let g of res.genres) this.genreMap[g.id] = g.name;
//     });
//   }

//   private loadSlides() {
//     // If data was passed from parent, use it—skip fetching.
//     if (this.slider.length) {
//       return;
//     }
//     // If in kids layout and no data, fetch kids posters only.
//     if (this.isKidsLayout) {
//       this.kidsService.getKidsSliderMovies().pipe(delay(2000))
//         .subscribe((res: any) => {
//           this.slider = res.results || [];
//         });
//     }
//     // If not kids layout, main slider fallback is handled in ngOnInit as before.
//   }

//   private startTimer() {
//     setInterval(() => {
//       if (this.slider.length) {
//         this.current = (this.current + 1) % this.slider.length;
//       }
//     }, 7000);
//   }

//   sliderTimer() {
//     setInterval(() => {
//       if (this.slider.length > 0) {
//         this.current = ++this.current % this.slider.length;
//       }
//     }, 7000);
//   }

//   getGenres() {
//     this.movieService.getMovieGenres().subscribe((res: any) => {
//       for (let genre of res.genres) {
//         this.genreMap[genre.id] = genre.name;
//       }
//     });
//   }

//   getnowPlayingMovies(page: number) {
//     this.movieService.getNowPlaying(page).pipe(delay(2000)).subscribe((res: any) => {
//       this.movies_data = res.results;
//     });
//   }
// }

import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { delay } from 'rxjs/operators';
import { DataService } from 'src/app/Services/data.service';
import { KidsDataService } from 'src/app/Services/kids-data.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition('* => void', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]),
    ])
  ]
})
export class SliderComponent implements OnInit {
  @Input() slider: any[] = [];
  @Input() isKidsLayout = false;

  current = 0;
  genreMap: { [key: number]: string } = {};

  constructor(
    private movieService: DataService,
    private kidsService: KidsDataService
  ) {}

  ngOnInit() {
    this.getGenres();
    this.loadSlides();
    this.startTimer();
  }

  private getGenres() {
    this.movieService.getMovieGenres().subscribe((res: any) => {
      for (let genre of res.genres) {
        this.genreMap[genre.id] = genre.name;
      }
    });
  }

  private loadSlides() {
    // If data was passed from parent, use it.
    if (this.slider.length) {
      return;
    }

    // If kids layout and no input, fetch kids posters.
    if (this.isKidsLayout) {
      this.kidsService.getKidsSliderMovies().pipe(delay(2000)).subscribe((res: any) => {
        this.slider = res.results || [];
      });
    } else {
      // Otherwise, fetch general now playing.
      this.movieService.getNowPlaying(1).pipe(delay(2000)).subscribe((res: any) => {
        this.slider = res.results || [];
      });
    }
  }

  private startTimer() {
    setInterval(() => {
      if (this.slider.length) {
        this.current = (this.current + 1) % this.slider.length;
      }
    }, 7000);
  }
}
