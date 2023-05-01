import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ho-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {

  @Input() text!:string;
  @Input() icon!:string;
  @Input() size!:{width:string;height:string};
  @Input() route!:string | Array<any>;
  @Input() isScrolled!:boolean;
  scrolledSize!:{width:string};

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(this.size==undefined){
        this.size={
          width: '144px',
          height: '40px'};
    }
    this.scrolledSize={width:`${parseFloat(this.size.width)/2}`};    
  }

  isDirectoryPath() {
    let tempRoute='';
    if (this.route instanceof Array){      
      this.route.forEach((val,i)=>{
        tempRoute+=`${val}`;
        if(i!==this.route.length-1){
          tempRoute+="/"
        }
      });      
    }else{
      tempRoute=this.route;
    }
    return this.router.isActive(tempRoute, true) && this.route!=undefined; // <-- boolean is for exactMatch
  }

}
