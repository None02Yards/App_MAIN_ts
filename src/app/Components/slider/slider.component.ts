
// slider.ts
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { delay } from 'rxjs/internal/operators/delay';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'] ,
  animations: [
    trigger('fade',
     [
      transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition('* => void', [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]),
    ])
  ]
})

export class SliderComponent implements OnInit {

  current = 0;

  movies_data: any;

  tv_shows: any;

  genreMap: { [key: number]: string } = {}; 


  constructor(
    private movieService: DataService,
  ) { }

  ngOnInit() {
    this.getnowPlayingMovies(1);
    this.getGenres();
    this.sliderTimer();
  }

  getGenres() {
    this.movieService.getMovieGenres().subscribe((res: any) => {
      for (let genre of res.genres) {
        this.genreMap[genre.id] = genre.name;
      }
    });
  }
  

  getnowPlayingMovies(page: number) {
    this.movieService.getNowPlaying(page).pipe(delay(2000)).subscribe((res: any) => {
      this.movies_data = res.results;
    });
  }

  sliderTimer() {
    setInterval(() => {
      this.current = ++this.current % this.movies_data.length;
    }, 7000);
  }

}
