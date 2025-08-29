

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
