import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ho-status-button',
  templateUrl: './status-button.component.html',
  styleUrls: ['./status-button.component.scss']
})
export class StatusButtonComponent implements OnInit {

  @Input() defaultIcon:string ="ci-circle_check";
  @Input() defaultText:string ="accepted";
  @Input() warningIcon:string ="ci-clock";
  @Input() warningText:string="error";
  @Input() warningStatus:boolean =false;

  constructor() { }

  ngOnInit(): void {
  }

}
