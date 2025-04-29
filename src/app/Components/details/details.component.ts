import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  mediaType:any;
  media:string=""
  id:any;
  videoSrc:any=""
  videoSafeURL!: any; 
  itemDetails:any=[]
  Trailer:string=""
  showRow:boolean=false
  showGenre=false



    constructor(private _Router: Router, private _DataService: DataService,
      private _ActivatedRoute: ActivatedRoute, private sanitizer: DomSanitizer,
      private Spinner:NgxSpinnerService) {
      this._ActivatedRoute.params.subscribe(()=>{
        this.mediaType=_ActivatedRoute.snapshot.paramMap.get("mediaType")
       if(this.mediaType=="tv"){
         this.media="Tv show"
       }
       else{
         this.media="Movie"
       }
        this.id=_ActivatedRoute.snapshot.paramMap.get("id")
       this.Spinner.show()
        this._DataService.getDetails(this.mediaType,this.id).subscribe((response)=>{
         this.Spinner.hide()
          this.itemDetails=response
          if(this.itemDetails.success==false){
            this._Router.navigateByUrl("/notfound")

          }
          if(this.itemDetails.genres[0]){
            this.showGenre=true
          }
        })
        this._DataService.getTrailer(this.mediaType,this.id).subscribe((videos)=>{
          this.Trailer=videos.results[0].key
          if(videos.results[0].key){
             this.showRow=true
          }
          this.videoSafeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${this.Trailer}?rel=0`
          );
                  })
      })

    }
    videoURL(videoSrcUrl:any) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(videoSrcUrl);
    }
  ngOnInit(): void {
  }

}
