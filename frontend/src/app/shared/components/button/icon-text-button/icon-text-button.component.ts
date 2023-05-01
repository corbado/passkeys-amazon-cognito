import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ho-icon-text-button',
  templateUrl: './icon-text-button.component.html',
  styleUrls: ['./icon-text-button.component.scss']
})
export class IconTextButtonComponent implements OnInit {

  @Input() disabled!:boolean;
  @Input() icon!:string;
  @Input() text!:string;
  @Input() size!:{width:string;height:string};
  @Input() class!:string;
  @Output() clickEvent= new EventEmitter();
 
  constructor() { }

  ngOnInit(): void {
  }

  clicked(){    
    this.clickEvent.emit();
  }

}
