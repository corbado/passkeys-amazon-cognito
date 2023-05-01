import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ho-support-bar',
  templateUrl: './support-bar.component.html',
  styleUrls: ['./support-bar.component.scss']
})
export class SupportBarComponent implements OnInit {

  isOpen:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

}
