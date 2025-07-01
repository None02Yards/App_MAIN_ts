import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../../home/home.component';
import { SliderComponent } from '../../slider/slider.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    //  AppComponent,
    HomeComponent, 
    SliderComponent,

    ],


  imports: [
    CommonModule,
     RouterModule,
    NgxSpinnerModule,
 ],
  exports: [HomeComponent, SliderComponent]
})
export class HomeLayoutModule {}
