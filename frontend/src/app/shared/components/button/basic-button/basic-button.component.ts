import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ho-basic-button',
  templateUrl: './basic-button.component.html',
  styleUrls: ['./basic-button.component.scss']
})
export class BasicButtonComponent implements OnInit {

  @Input() disabled:boolean=false;
  @Input() text!:string;
  @Input() size!:{width:string;height:string;'margin-top'?:string};
  @Input() color!:'blue'|'orange'|'gray'|'outline-blue';
  @Output() clickAction=new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  clicked(){
    if(!this.disabled){
      this.clickAction.emit();
    }    
  }

}
