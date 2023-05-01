import { Component, OnInit, Input} from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { CarouselItemModel } from '../../../models/carousel-conf.model';

@Component({
  selector: 'ho-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  /**
   * Custom Properties
   */
  @Input() size!:{width:string;height:string};
  @Input() isFullScreen !: boolean;
  @Input() items: CarouselItemModel[] = [];

  /**
   * Final Properties
   */
  public finalHeight: string | number = 0;
  public currentPosition = 0;
  public finalWidth: string | number = 0;

  constructor(public utils:UtilsService) {   
    if(this.size===undefined){      
      this.size={width:'590px',height:'542px'}
    } 
   }


  ngOnInit() {
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.size.height}`;
    this.finalWidth= this.isFullScreen ? '100vw' : `${this.size.width}`;    
    this.items.map( ( i, index ) => {
      if(i.order==undefined){
        i.order = index;
      }
      if(i.marginLeft==undefined){        
        i.marginLeft = 0;
      }
      
    });
  }

 
  setCurrentPosition(position: number) {
    this.currentPosition = position;    
    this.utils.ensure(this.items.find(i => i.order === 0)).marginLeft = -100 * position;
  }

  setNext() {
    let finalPercentage = 0;
    let nextPosition = this.currentPosition + 1;
    if (nextPosition <= this.items.length - 1) {
      finalPercentage = -100 * nextPosition;
    } else {
      nextPosition = 0;
    }
    this.utils.ensure(this.items.find(i => i.order === 0)).marginLeft = finalPercentage;
    this.currentPosition = nextPosition;
  }

  setBack() {
    let finalPercentage = 0;
    let backPosition = this.currentPosition  - 1;
    if (backPosition >= 0) {
      finalPercentage = -100 * backPosition;
    } else {
      backPosition = this.items.length - 1;
      finalPercentage = -100 * backPosition;
    }
    this.utils.ensure(this.items.find(i => i.order === 0)).marginLeft = finalPercentage;
    this.currentPosition = backPosition;

  }

}
