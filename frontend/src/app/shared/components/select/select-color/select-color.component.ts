import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OptionSelect } from '@corbado/models/option-select.model';
import { ProductCategory } from 'src/app/services/product-category.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'ho-select-color',
  templateUrl: './select-color.component.html',
  styleUrls: ['./select-color.component.scss']
})
export class SelectColorComponent implements OnInit {

  @ViewChild('select') selectRef:any;
  @ViewChild('option') option!:ElementRef; 
  @Input() optionList!:OptionSelect[];
  @Input() idOption!:number|string;
  check=false;
  @Input() title!:string;
  @Output() clickEvent = new EventEmitter<number>();
  selectForm:FormGroup;
  clicked=false;

  constructor(private fb:FormBuilder, public utils:UtilsService) { 
    
    this.selectForm=this.fb.group({
      selectInfo:['']
    })
  }

  ngOnInit(): void {
    if(this.idOption)this.selectForm.controls['selectInfo'].setValue(this.utils.ensure(this.idOption));
    // .setStyle(this.subbar._elementRef.nativeElement, 'backgroundColor', '#ff0000');
  }

  emitInfo(){
    let {selectInfo} = this.selectForm.value;
    this.clickEvent.emit(selectInfo);
  }

  findByIdOptions(param:'color'|'name'){
    return this.utils.ensure(this.optionList.find(option => option.id==this.selectForm.value.selectInfo))[param]
  }

  clickAction(){
    if(this.clicked){
      setTimeout(() =>{
        this.selectRef.close()
      },150)
      
    };
    this.clicked=false;
    
  }

}
