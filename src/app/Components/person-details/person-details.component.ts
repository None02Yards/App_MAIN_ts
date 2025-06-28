import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from 'src/app/Services/data.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {


page:number=0
personData:any=[]
knownFor:any[]=[]
moreToExploreCelebs: any[] = [];
id:any;
profileSrc:string = "";
Src:any=[];
showFullBio = false;
  personId: string = '';
  roles: string[] = [];

  
  constructor(
    private _Router:Router,
    private _DataService:DataService,
    private _ActivatedRoute:ActivatedRoute,
     private router: Router,
    )
    {
    this.id=_ActivatedRoute.snapshot.paramMap.get("id")
    _DataService.getDetails("person",this.id).subscribe((response)=>{
      this.personData=response

      this.profileSrc=`https://image.tmdb.org/t/p/original/${this.personData.profile_path}`
    })
    _DataService.getCredits(this.id).subscribe((data)=>{
      this.knownFor=data.cast
      this.knownFor=this.knownFor.filter((item)=>{
        return item.poster_path!=null
      })
    })
   }

  ngOnInit(): void {
  this.getMoreToExploreCelebs();
 this.loadPerson();

  this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadPerson();
      });

  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
goBack(): void {
  history.back();
}

loadPerson(): void {
  this.personId = this._ActivatedRoute.snapshot.paramMap.get('id')!;

  this._DataService.getDetails("person", this.personId).subscribe((response) => {
    this.personData = response;
    this.profileSrc = `https://image.tmdb.org/t/p/original/${this.personData.profile_path}`;
  });

  this._DataService.getCredits(this.personId).subscribe((data) => {
    this.knownFor = data.cast?.filter((item: any) => item.poster_path != null);
  });

  this._DataService.getCombinedCredits(this.personId).subscribe((data) => {
    const hasActing = data.cast && data.cast.length > 0;
    const crewJobs = data.crew?.map((c: any) => c.job);
    const uniqueJobs = new Set(crewJobs);

    this.roles = [];
    if (hasActing) this.roles.push("Actor");
    if (uniqueJobs.has("Writer")) this.roles.push("Writer");
    if (uniqueJobs.has("Director")) this.roles.push("Director");
    if (uniqueJobs.has("Producer")) this.roles.push("Producer");
  });
}
getMoreToExploreCelebs(): void {
  this._DataService.getPeople(1).subscribe((res: any) => {
    const allCelebs = res.results;
    this.moreToExploreCelebs = this.getRandomItems(allCelebs, 3);
  });
}

getRandomItems(array: any[], count: number): any[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
 get formattedBio(): string[] {
  if (!this.personData?.biography) return [];
  return this.personData.biography
    .split('. ')
    .map((sentence: string) => sentence.trim())
    .filter((sentence: string) => sentence.length > 0)
    .map((sentence: string) => (sentence.endsWith('.') ? sentence : sentence + '.'));
}
  
get visibleBio(): string[] {
  return this.showFullBio ? this.formattedBio : this.formattedBio.slice(0, 3);
}

  toggleBio(): void {
    this.showFullBio = !this.showFullBio;
  }
  
}
