import { Component, Input, OnInit } from '@angular/core';
import { CardConfModel } from '@corbado/models/card-conf.model';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ho-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() cardConf !: CardConfModel;

  constructor(public utils:UtilsService) {}

  ngOnInit(): void {}
  

  sizeDefined(){
    return (this.cardConf.size==undefined) ?  {width:"233px",height:"280px"} :  this.cardConf.size;    
  }

}
