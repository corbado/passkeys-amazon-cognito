import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

export interface AccordionData{
  id:number | string;
  question:string;
  answer:string;
  active?:boolean;
  section?:string;
}

@Component({
  selector: 'ho-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

  @Input() data!:AccordionData[];

  constructor(public utils:UtilsService) {  }

  ngOnInit(): void {    
    this.setActive();
  }

  setActive(){
    this.utils.ensure(this.data).forEach((val:AccordionData)=>{
      if(val.active===undefined){
        val.active=false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setActive();
  }


}
