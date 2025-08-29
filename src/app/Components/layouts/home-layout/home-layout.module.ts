
// src\app\Components\layouts\home-layout\home-layout.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../../home/home.component';
import { SliderComponent } from '../../slider/slider.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/Components/shared/shared.module'; 

@NgModule({
  declarations: [
    HomeComponent, 
    SliderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    SharedModule 
  ],
  exports: [HomeComponent, SliderComponent]
})
export class HomeLayoutModule {}
