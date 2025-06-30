import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KidsDataService {
  private apiKey = environment.APIKey;
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getKidsTrending(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trending/all/day?api_key=${this.apiKey}&with_keywords=animation`);
  }

  getKidsMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=16,10751&certification_country=US&certification.lte=G`);
  }

  getKidsTVShows(): Observable<any> {
    return this.http.get(`${this.baseUrl}/discover/tv?api_key=${this.apiKey}&with_genres=16,10751&certification_country=US&certification.lte=TV-Y7`);
  }

  getMoreToExploreForKids(): Observable<any[]> {
    const staffPicks = this.getKidsMovies().pipe(
      map((res: any) => ({
        title: 'Staff Picks: Kids Fun',
        linkText: 'See our picks',
        link: '#',
        posters: res.results.slice(0, 6)
      }))
    );

    const trending = this.getKidsTrending().pipe(
      map((res: any) => ({
        title: 'Trending Animation Now',
        linkText: 'Explore Now',
        link: '#',
        posters: res.results.slice(0, 6)
      }))
    );

    const familyTime = this.getKidsTVShows().pipe(
      map((res: any) => ({
        title: 'Family Shows to Binge',
        linkText: 'Watch Together',
        link: '#',
        posters: res.results.slice(0, 6)
      }))
    );

    return forkJoin([staffPicks, trending, familyTime]);
  }

  getKidsVideos(): Observable<any> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`;
    return this.http.get(url);
  }
}