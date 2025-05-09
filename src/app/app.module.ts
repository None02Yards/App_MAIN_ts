import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './Core/navbar/navbar.component';
import { FooterComponent } from './Core/footer/footer.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './Components/home/home.component';
import { SliderComponent } from './Components/slider/slider.component';
import { MoviesComponent } from './Components/movies/movies.component';
import { NotFoundPageComponent } from './Components/not-found-page/not-found-page.component';
import { PeopleComponent } from './Components/people/people.component';
import { PersonDetailsComponent } from './Components/person-details/person-details.component';
import { SearchComponent } from './Components/search/search.component';
import { TVShowsComponent } from './Components/tvshows/tvshows.component';
import { AboutComponent } from './Components/about/about.component';
import { DetailsComponent } from './Components/details/details.component';
import { WatchlistComponent } from './Components/watchlist/watchlist.component';
import { WelcomeComponent } from './welcome/welcome.component';
// import { MoviesWatchlistComponent } from './Components/watchlist/movies-watchlist/movies-watchlist.component';
// import { TvWatchlistComponent } from './Components/watchlist/tv-watchlist/tv-watchlist.component'; // Add this import
// import { AnimeWatchlistComponent } from './Components/watchlist/anime-watchlist/anime-watchlist.component'; // Add this import
// import { WatchlistCardComponent } from './Components/shared/watchlist-card/watchlist-card.component';
// import { SharedModule } from './Components/shared/shared.module'; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SliderComponent,
    MoviesComponent,
    NotFoundPageComponent,
    PeopleComponent,
    PersonDetailsComponent,
    SearchComponent,
    TVShowsComponent,
    AboutComponent,
    DetailsComponent,
    WatchlistComponent,
    WelcomeComponent,
    // WatchlistCardComponent,
    // MoviesWatchlistComponent,
    // TvWatchlistComponent, // Declare this component
    // AnimeWatchlistComponent, // Declare this component

  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    AppRoutingModule,
    // SharedModule,

],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
