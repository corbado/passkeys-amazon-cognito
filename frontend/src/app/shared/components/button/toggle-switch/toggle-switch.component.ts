import { Component, OnInit, Output , EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ho-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {

  constructor() { }
  @Input() checked!:boolean;
  @Input() disabled!:boolean;
  @Output() clickAction = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (this.checked==undefined){
      this.checked=false;
    }
    if (this.disabled==undefined){
      this.disabled=false;
    }
  }

  changeState(){    
    this.checked=!this.checked;
    this.clickAction.emit(this.checked);        
  }

}
