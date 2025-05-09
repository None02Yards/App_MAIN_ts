import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './Components/home/home.component';
import { NotFoundPageComponent } from './Components/not-found-page/not-found-page.component';
import { AboutComponent } from './Components/about/about.component';
import { DetailsComponent } from './Components/details/details.component';
import { MoviesComponent } from './Components/movies/movies.component';
import { PeopleComponent } from './Components/people/people.component';
import { PersonDetailsComponent } from './Components/person-details/person-details.component';
import { SearchComponent } from './Components/search/search.component';
import { TVShowsComponent } from './Components/tvshows/tvshows.component';
import { WatchlistComponent } from './Components/watchlist/watchlist.component';
// import { MoviesWatchlistComponent } from './Components/watchlist/movies-watchlist/movies-watchlist.component';
// import { TvWatchlistComponent } from './Components/watchlist/tv-watchlist/tv-watchlist.component';
// import { AnimeWatchlistComponent } from './Components/watchlist/anime-watchlist/anime-watchlist.component';




const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  
  {
    path: 'about', component: AboutComponent, 
  },
  {
    path: 'movies/:genre/:page', component: MoviesComponent, 
  },
  {
    path: 'tvshows/:genre/:page', component: TVShowsComponent, 
  },
{
  path: 'watchlist',
  component: WatchlistComponent,
  // children: [
  //   { path: 'movies', component: MoviesWatchlistComponent },
  //   { path: 'tv', component: TvWatchlistComponent },
  //   { path: 'anime', component: AnimeWatchlistComponent },
  //   { path: '', redirectTo: 'movies', pathMatch: 'full' }
  // ]
},

  {
    path: 'details/:mediaType/:id', component: DetailsComponent, 
  },
  {
    path: 'person/:id', component: PersonDetailsComponent, 
  },
  {
    path: 'search/:target', component: SearchComponent,
  },
  {
    path: 'people/:page', component: PeopleComponent,
  },

  {
    path: '**', component: NotFoundPageComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
