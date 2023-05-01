import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ho-incremental',
  templateUrl: './incremental.component.html',
  styleUrls: ['./incremental.component.scss']
})
export class IncrementalComponent implements OnInit {
  
  @Input() number!:number;
  @Input() min!:number;
  @Input() disabled!:boolean;
  @Output() newValue: EventEmitter<number>= new EventEmitter<number>();

  constructor() {
    if(this.number==undefined){
      this.number=0
    }
    if(this.disabled==undefined){
      this.disabled=false;
    }    
    if(this.min==undefined){
      this.min=0;
    }
   }

  ngOnInit(): void {}

  changeValue(val:number):void{
    if(!this.disabled){
      if(val>=this.min){
        this.number=val;
        this.newValue.emit(this.number);
      }
    }
  }

}
