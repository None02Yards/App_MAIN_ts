

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin, combineLatest } from 'rxjs'; // <-- combineLatest added here!
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class KidsDataService {
  private baseUrl = environment.MovieAPI;
  private apiKey = environment.APIKey;
  private base = environment.MovieAPI;
  private key  = environment.APIKey;

  constructor(private http: HttpClient) {}

  /** Trending kids content (movies + TV combined) */
  getKidsTrending(): Observable<any> {
    const tvUrl = `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=10762&certification_country=US&certification.lte=TV-Y7&include_adult=false&sort_by=popularity.desc&language=en-US`;
    const movieUrl = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=16,10751,14&certification_country=US&certification.lte=G&include_adult=false&sort_by=popularity.desc&language=en-US`;

    return forkJoin([this.http.get(tvUrl), this.http.get(movieUrl)]).pipe(
      map(([tv, mv]: any[]) => ({
        results: [...tv.results, ...mv.results]
      }))
    );
  }

  getKidsSliderMovies(): Observable<{ results: any[] }> {
    const url = `${this.base}/discover/movie`
      + `?api_key=${this.key}`
      + `&with_genres=16,10751,14`
      + `&certification_country=US&certification.lte=G`
      + `&include_adult=false`
      + `&sort_by=popularity.desc`
      + `&language=en-US`;
    return this.http.get<{ results: any[] }>(url);
  }


getFamilyMovies(): Observable<any> {
  const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=10751&certification_country=US&certification.lte=G&include_adult=false&sort_by=popularity.desc&language=en-US`;
  return this.http.get(url);
}

getFamilyTVShows(): Observable<any> {
  const url = `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=10751&certification_country=US&certification.lte=TV-Y7&include_adult=false&sort_by=popularity.desc&language=en-US`;
  return this.http.get(url);
}


  /** Get just kids movies */
  getKidsMovies(): Observable<any> {
    const url = `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=16,10751,14&certification_country=US&certification.lte=G&include_adult=false&sort_by=popularity.desc&language=en-US`;
    return this.http.get(url);
  }

  /** Get just kids TV shows */
  getKidsTVShows(): Observable<any> {
    const url = `${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=10762&certification_country=US&certification.lte=TV-Y7&include_adult=false&sort_by=popularity.desc&language=en-US`;
    return this.http.get(url);
  }

  /** Get videos/trailers for a given kids movie */
  getKidsVideos(movieId: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=en-US`;
    return this.http.get(url);
  }




  /** Kids exclusive videos  */
  getKidsExclusiveVideos(): Observable<any[]> {
    return this.getKidsMovies().pipe(
      switchMap((data: any) => {
        const movies = data.results.slice(0, 5);
        const requests = movies.map((movie: any) =>
          this.getKidsVideos(movie.id).pipe(
            map((trailers: any) => {
              const video = trailers.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
              if (video) {
                return {
                  title: movie.title,
                  videoUrl: `https://www.youtube.com/watch?v=${video.key}`,
                  imageUrl: movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                    : 'https://via.placeholder.com/500',
                  key: video.key
                };
              }
              return null;
            })
          )
        );
       return combineLatest(requests as Observable<any>[]) as Observable<any[]>;
      })
    );
  }

  /** "More to Explore" cards */
  // getMoreToExploreForKids(): Observable<any[]> {
  //   return forkJoin([this.getKidsMovies(), this.getKidsTVShows()]).pipe(
  //     map(([movies, shows]: any[]) => [
  //       {
  //         title: 'Fun with Animation',
  //         linkText: 'Watch now',
  //         link: '#',
  //         posters: movies.results.slice(0, 6)
  //       },
  //       {
  //         title: 'TV Shows for Kids',
  //         linkText: 'Browse',
  //         link: '#',
  //         posters: shows.results.slice(0, 6)
  //       },

  //        {
  //         title: 'Shows for Family',
  //         linkText: 'Browse',
  //         link: '#',
  //         posters: shows.results.slice(0, 6)
  //       }
  //     ])
  //   );
  // }

  getMoreToExploreForKids(): Observable<any[]> {
  return forkJoin([
    this.getKidsMovies(),
    this.getKidsTVShows(),
    this.getFamilyMovies(), 
  ]).pipe(
    map(([movies, shows, family]: any[]) => [
      {
        title: 'Fun with Animation',
        linkText: 'Watch now',
        link: '#',
        posters: movies.results.slice(0, 6)
      },
      {
        title: 'TV Shows for Kids',
        linkText: 'Browse',
        link: '#',
        posters: shows.results.slice(0, 6)
      },
      {
        title: 'Family Time', 
        linkText: 'See all',
        link: '#',
        posters: family.results.slice(0, 6)
      }
    ])
  );
}

}

