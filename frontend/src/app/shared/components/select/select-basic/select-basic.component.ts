import { UtilsService } from './../../../../services/utils.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OptionSelect } from '@corbado/models/option-select.model';

@Component({
  selector: 'ho-select-basic',
  templateUrl: './select-basic.component.html',
  styleUrls: ['./select-basic.component.scss'],
})
export class SelectBasicComponent implements OnInit {
  @ViewChild('select') selectRef:any;
  @Input() width?: string = '100%';
  @Input() optionList!: OptionSelect[];
  @Input() optionId!: number | string;
  @Input() title: string = 'Something';
  @Output() clickEvent = new EventEmitter<number>();
  selectForm: FormGroup = this.fb.group({
    select:['']
  });
  clicked?:boolean=false;

  constructor(private fb:FormBuilder, private utils:UtilsService) {
  }

  ngOnInit(): void {
    this.selectForm.controls["select"].setValue(this.optionId?this.optionId:'')
  }

  getNameById():string{
    if(this.selectForm.value.select){
      return this.utils.ensure(this.optionList.find(option=>option.id==this.selectForm.value.select)).name;
      
    }else{
      return this.title;
    }
  }

  clickAction(){
    if(this.clicked){
      setTimeout(() =>{
        this.selectRef.close()
      },150)
      
    };
    this.clicked=false;
    
  }

  emitInfo(){
    this.clickEvent.emit(this.selectForm.value.select)
  }


}
