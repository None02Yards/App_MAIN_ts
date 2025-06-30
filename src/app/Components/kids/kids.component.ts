import { Component, OnInit } from '@angular/core';
import { KidsDataService } from 'src/app/Services/kids-data.service'; // Adjust path if needed

@Component({
  selector: 'app-kids',
  templateUrl: './kids.component.html',
  styleUrls: ['./kids.component.scss']
})
export class KidsComponent implements OnInit {
  kidsSlider: any[] = [];
  trendingMovies: any[] = [];
  topTenKidsShows: any[] = [];
  kidsMoreToExplore: any[] = [];
  kidsExclusiveVideos: any[] = [];
  kidsQuote: string = 'For every child, there’s a story waiting to be told.';

  constructor(private kidsData: KidsDataService) {}

  ngOnInit(): void {
    this.fetchKidsSlider();
    this.fetchTrendingMovies();
    this.fetchTopTenShows();
    this.fetchMoreToExplore();
    this.fetchExclusiveVideos();
  }

  fetchKidsSlider() {
    this.kidsData.getKidsTrending().subscribe(data => {
      this.kidsSlider = data?.results?.slice(0, 10);
    });
  }

  fetchTrendingMovies() {
    this.kidsData.getKidsMovies().subscribe(data => {
      this.trendingMovies = data?.results?.slice(0, 15);
    });
  }

  fetchTopTenShows() {
    this.kidsData.getKidsTVShows().subscribe(data => {
      this.topTenKidsShows = data?.results?.slice(0, 10);
    });
  }

  fetchMoreToExplore() {
    this.kidsData.getMoreToExploreForKids().subscribe(data => {
      this.kidsMoreToExplore = data;
    });
  }

  fetchExclusiveVideos() {
    this.kidsData.getKidsVideos().subscribe(data => {
      this.kidsExclusiveVideos = data?.results?.slice(0, 6);
    });
  }

  goToPopularKidsTVShows(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Replace with a router link if needed
  }
}
