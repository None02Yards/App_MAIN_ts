import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  notice:boolean=true
  disablePrev:boolean=false
  disableNext:boolean=true
  page:number=0
  people:any[]=[]

  constructor(
    private _DataService: DataService,
    private _ActivatedRoute:ActivatedRoute,
    private Spinner:NgxSpinnerService)

    {

    this.Spinner.show()
    this._ActivatedRoute.params.subscribe(() =>
    {
        this.page=Number(_ActivatedRoute.snapshot.paramMap.get("page"))
        if (this.page==1)
        {
          this.disablePrev=false
        }
        else
        {
          this.disablePrev=true
        }
        this._DataService.getData("person","popular",this.page).subscribe((response)=>{
          this.Spinner.hide()
                  this.people=response.results.filter((item:any)=>{
            return item.profile_path!=null
          })
      })
      })
    }

    Next()
    {
      this.disablePrev=true
    if(this.page==1000||this.notice==false)
    {
      this.disableNext=false
    }
    else
    {
      this.disableNext=true
      this.page=this.page+1
    }
  }

    Prev(){
    if(this.notice == false)
    {
      this.disablePrev = false
    }
  else if(this.page == 2)
  {
    this.disablePrev=false
    this.page=this.page-1
  }
  else
  {
  this.page=this.page-1
  }
  }
    ngOnInit(): void {
    }

}
