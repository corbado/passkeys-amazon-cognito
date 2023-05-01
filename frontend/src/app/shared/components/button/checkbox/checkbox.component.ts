import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ho-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() isChecked:boolean=true;
  @Input() isDisabled:boolean=false;
  @Output() checkStatus = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  changeState(){
    if(!this.isDisabled){
      this.isChecked=!this.isChecked;      
      this.checkStatus.emit(this.isChecked);
    }
  }

}
