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

searchByType(query: string, type: string): Observable<any> {
  const url = `https://api.themoviedb.org/3/search/${type}?query=${query}&api_key=${this.APIKey}`;
  return this._HttpClient.get(url);
}


searchMulti(query: string, type: string): Observable<any> {
  return this._HttpClient.get(`${this.MovieAPI}/search/${type}?query=${query}&api_key=${this.APIKey}`);
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

  getPersonCredits(id: number): Observable<any> {
  return this._HttpClient.get(`${this.MovieAPI}/person/${id}/movie_credits?api_key=${this.APIKey}`).pipe(
    catchError(this.handleError)
  );
}

// This is for getting cast of a movie or TV show
getMediaCredits(mediaType: string, id: number): Observable<any> {
  return this._HttpClient.get(`${this.MovieAPI}/${mediaType}/${id}/credits?api_key=${this.APIKey}`).pipe(
    catchError(this.handleError)
  );
}
getPeople(page: number = 1): Observable<any> {
  return this._HttpClient.get(
    `https://api.themoviedb.org/3/person/popular?api_key=${this.APIKey}&language=en-US&page=${page}`
  );
}

getPersonDetails(id: string): Observable<any> {
  return this._HttpClient.get(
    `https://api.themoviedb.org/3/person/${id}?api_key=${this.APIKey}&language=en-US`
  );
}

getCombinedCredits(id: string): Observable<any> {
  return this._HttpClient.get(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${this.APIKey}&language=en-US`
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

getFreeToWatch(type: 'movie' | 'tv'): Observable<any> {
  const url = `${this.MovieAPI}/discover/${type}?api_key=${this.APIKey}&with_watch_monetization_types=free&sort_by=popularity.desc`;
  return this._HttpClient.get(url).pipe(catchError(this.handleError));
}



getTrailerCategory(category: string): Observable<any> {
  let url = '';

  switch (category) {
    case 'popular':
      url = `${this.MovieAPI}/movie/popular?api_key=${this.APIKey}`;
      break;
    case 'streaming':
      url = `${this.MovieAPI}/movie/upcoming?api_key=${this.APIKey}`;
      break;
   case 'on_tv':
  const randomPage = Math.floor(Math.random() * 5) + 1;
  url = `${this.MovieAPI}/discover/tv?api_key=${this.APIKey}&with_watch_monetization_types=flatrate&sort_by=popularity.desc&page=${randomPage}`;
  break;

    case 'for_rent':
      url = `${this.MovieAPI}/discover/movie?api_key=${this.APIKey}&with_watch_monetization_types=rent`;
      break;
    case 'in_theaters':
      url = `${this.MovieAPI}/movie/now_playing?api_key=${this.APIKey}`;
      break;
    default:
      url = `${this.MovieAPI}/movie/popular?api_key=${this.APIKey}`;
  }

  return this._HttpClient.get(url).pipe(catchError(this.handleError));
}







// getTrailerCategory(category: string): Observable<any> {
//   let url = '';

//   switch (category) {
//     case 'popular':
//       url = `${this.MovieAPI}/movie/popular?api_key=${this.APIKey}`;
//       break;
//     case 'streaming':
//       url = `${this.MovieAPI}/discover/movie?api_key=${this.APIKey}&with_watch_monetization_types=flatrate`;
//       break;
//     case 'on_tv':
//       url = `${this.MovieAPI}/discover/tv?api_key=${this.APIKey}&with_watch_monetization_types=flatrate`;
//       break;
//     case 'for_rent':
//       url = `${this.MovieAPI}/discover/movie?api_key=${this.APIKey}&with_watch_monetization_types=rent`;
//       break;
//     case 'in_theaters':
//       url = `${this.MovieAPI}/movie/now_playing?api_key=${this.APIKey}`;
//       break;
//     default:
//       url = `${this.MovieAPI}/movie/popular?api_key=${this.APIKey}`;
//   }

//   return this._HttpClient.get(url).pipe(catchError(this.handleError));
// }


// Get YouTube Trailer Key for a movie (returns a Promise)
getYoutubeTrailerKey(id: number, apiKey: string, mediaType: 'movie' | 'tv' = 'movie'): Promise<string | null> {
  const videoUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}`;
  return fetch(videoUrl)
    .then(res => res.json())
    .then(data => {
      const video = data.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
      return video ? video.key : null;
    })
    .catch(() => null);
}


}

