
import { Component, OnInit } from '@angular/core';
import { KidsDataService } from 'src/app/Services/kids-data.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.scss']
})
export class KidsComponent implements OnInit {
   kidsSlider: any[] = [];

  kidsTrending: any[] = [];
  kidsTrendingMovies: any[] = [];
  kidsTrendingTV: any[] = [];
  topTenKids: any[] = [];
  kidsMoreToExplore: any[] = [];
  kidsTrailers: any[] = [];
kidsExclusiveVideos: any[] = [];

  kidsQuotes: string[] = [
    'For every child, there’s a story waiting to be told.',
    'Imagination is the key to discovery.',
    'Adventure begins with a smile.',
    'Every day is a chance to learn something magical.',
    'Dream big, little one!'
  ];

  kidsQuoteGradients: string[] = [
  'linear-gradient(90deg, #ffb347, #ffcc33)',
  'linear-gradient(90deg, #87ceeb, #a3e635)',
  'linear-gradient(90deg, #fb7185, #facc15)',
  'linear-gradient(90deg, #a18cd1, #fbc2eb)',
  'linear-gradient(90deg, #fbc2eb, #a6c1ee)'
];
  kidsQuote: string = '';

  constructor(private kidsData: KidsDataService) {}

  ngOnInit(): void {
    
    this.kidsQuote = this.getRandomQuote();
    this.fetchKidsSlider();


    setInterval(() => {
      this.kidsQuote = this.getRandomQuote();
    }, 10000);

    this.kidsData.getKidsTrending().subscribe((data) => {
      this.kidsTrending = data.results;
    });

    this.kidsData.getKidsMovies().subscribe((data) => {
      this.kidsTrendingMovies = data.results.slice(0, 10);
    });

    this.kidsData.getKidsTVShows().subscribe((data) => {
      this.kidsTrendingTV = data.results.slice(0, 10);
      this.topTenKids = data.results.slice(0, 10);
    });

    this.kidsData.getMoreToExploreForKids().subscribe((sections) => {
      this.kidsMoreToExplore = sections;
    });

  
    this.kidsData.getKidsMovies().subscribe((data) => {
      this.kidsTrendingMovies = data.results.slice(0, 10);

      const firstMovieId = this.kidsTrendingMovies[0]?.id;
      if (firstMovieId) {
        this.kidsData.getKidsVideos(firstMovieId).subscribe((trailers) => {
          this.kidsTrailers = trailers.results?.map((v: any) => ({
            title: v.name,
            videoUrl: `https://www.youtube.com/watch?v=${v.key}`,
            imageUrl: 'https://via.placeholder.com/500',
            key: v.key,
          }));
        });


        this.kidsData.getKidsExclusiveVideos().subscribe((videos) => {
        this.kidsExclusiveVideos = videos;
});

  }
});

  }

  private fetchKidsSlider() {
    // Grab only G-rated Animation/Family/Fantasy movies:
    this.kidsData.getKidsSliderMovies()
      .pipe(delay(2000))
      .subscribe((res: any) => {
        this.kidsSlider = res.results || [];
      });
  }

  getRandomQuote(): string {
    const i = Math.floor(Math.random() * this.kidsQuotes.length);
    return this.kidsQuotes[i];
  }

  goToPopularTVShows = () => {
    // Optional route logic
  };
}
