import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  readonly MovieAPI = environment.MovieAPI;
  readonly APIKey = environment.APIKey;

  constructor(private _HttpClient: HttpClient) {}


  getTrending(mediaType: any): Observable<any>{
    return this._HttpClient.get(`${this.MovieAPI}/trending/${mediaType}/day?api_key=${this.APIKey}`).pipe(
      catchError(this.handleError)
    );
  }
getSimilar(mediaType: string, id: number): Observable<any> {
  return this._HttpClient.get(`${this.MovieAPI}/${mediaType}/${id}/similar?api_key=${this.APIKey}`).pipe(
    catchError(this.handleError)
  );
}


  getData(mediaType:any,mediaCategory:any,page:number): Observable<any>{
    return this._HttpClient.get(`${this.MovieAPI}/${mediaType}/${mediaCategory}?api_key=${this.APIKey}&page=${page}`).pipe(
      catchError(this.handleError)
    );
  }

  getDetails(mediaType:any,id:any): Observable<any>{
    return this._HttpClient.get(`${this.MovieAPI}/${mediaType}/${id}?api_key=${this.APIKey}`).pipe(
      catchError(this.handleError)
    );
  }

  getTrailer(mediaType:any,id:any): Observable<any>{
    return this._HttpClient.get(`${this.MovieAPI}/${mediaType}/${id}/videos?api_key=${this.APIKey}`).pipe(
      catchError(this.handleError)
    );
  }

  getCredits(id:any): Observable<any>{
    return this._HttpClient.get(`${this.MovieAPI}/person/${id}/movie_credits?api_key=${this.APIKey}`).pipe(
      catchError(this.handleError)
    );
  }

  search(searchText:any):Observable<any>{
    return this._HttpClient.get(`${this.MovieAPI}/search/multi?api_key=${this.APIKey}&query=${searchText}`).pipe(
      catchError(this.handleError)
    );
  }

  getNowPlaying(page: number): Observable<any> {
    return this._HttpClient.get(`${this.MovieAPI}/movie/now_playing?api_key=${this.APIKey}&page=${page}`).pipe(
      catchError(this.handleError)
    );
  }
  getEntertainmentNews(): Observable<any> {
    return this._HttpClient.get('YOUR_NEWS_API_URL');
  }
  
  getMovieGenres(): Observable<any> {
    return this._HttpClient.get(`${this.MovieAPI}/genre/movie/list?api_key=${this.APIKey}&language=en-US`).pipe(
      catchError(this.handleError)
    );
  }
  
  
//****************  HandleError ***************//
//** We Can make another Solution in Error Interceptor */

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

  // Fetch generic API endpoint
fetchFromApi(url: string): Observable<any> {
  return this._HttpClient.get(url).pipe(
    catchError(this.handleError)
  );
}

// Get YouTube Trailer Key for a movie (returns a Promise)
getYoutubeTrailerKey(movieId: number, apiKey: string): Promise<string | null> {
  const videoUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
  return fetch(videoUrl)
    .then((res) => res.json())
    .then((data) => {
      const video = data.results.find(
        (v: any) => v.site === 'YouTube' && v.type === 'Trailer'
      );
      return video ? video.key : null;
    })
    .catch(() => null);
}


}

