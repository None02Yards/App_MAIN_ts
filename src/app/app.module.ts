import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { FormsModule } from '@angular/forms';

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
import { MoviesWatchlistComponent } from './Components/watchlist/movies-watchlist/movies-watchlist.component';
import { TvWatchlistComponent } from './Components/watchlist/tv-watchlist/tv-watchlist.component'; // Add this import
// import { AnimeWatchlistComponent } from './Components/watchlist/anime-watchlist/anime-watchlist.component'; // Add this import
// import { WatchlistCardComponent } from './Components/shared/watchlist-card/watchlist-card.component';
import { SharedModule } from './Components/shared/shared.module'; 
import { CustomListDetailComponent } from './Components/watchlist/custom-list-detail/custom-list-detail.component';
import { CreateListComponent } from './Components/watchlist/create-list/create-list.component';
import { SidebarComponent } from './Core/sidebar/sidebar.component';
import { KidsComponent } from './Components/kids/kids.component';

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
     TvWatchlistComponent,
  MoviesWatchlistComponent,
  CustomListDetailComponent,
  CreateListComponent,
  SidebarComponent,
  KidsComponent,

    // No need to declare WatchlistCardComponent here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    SharedModule, // ✅ Brings in WatchlistCardComponent
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

