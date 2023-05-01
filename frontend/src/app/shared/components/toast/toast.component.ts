import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'ho-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  information:boolean=false;
  success:boolean=false;
  warning:boolean=false;
  loading:boolean=false;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {message:string,class:"information"|"success"|"warning"|"loading",emoji:string}) { 
    switch(this.data.class){
      case 'success':
        this.success = true;
        break;
      case 'warning':
        this.warning = true;
        break;
      case 'loading':
        this.loading = true;
        break;
      case 'information':
        this.information = true;

    }
  }

  ngOnInit(): void {
  }

}
