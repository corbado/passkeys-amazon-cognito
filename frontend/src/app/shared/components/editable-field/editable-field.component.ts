import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'ho-editable-field',
  templateUrl: './editable-field.component.html',
  styleUrls: ['./editable-field.component.scss']
})
export class EditableFieldComponent implements OnInit {
  @Input() textClass!:string;
  @Input() tag!:string;
  @Input() centerText!:boolean;
  @Input() isEditable!:boolean;
  @Input() height!:string;
  @Input() oldValue!:string;
  @Input() textarea!:boolean;
  @Input() defaultButtonVisibility:'visible'|'hidden'='visible';
  @Input() size!:{width:string,height:string};
  
  @Output() valueChanged:EventEmitter<any>=new EventEmitter<any>();
  
  @ViewChild('textAreaFocus') textAreaFocus!:ElementRef;
  @ViewChild('inputFocus') inputFocus!:ElementRef;

  public newValue!:string;
  public isEditing:boolean=false;
  public textLength!:number;
  
  
  
  constructor(public utils:UtilsService) { }

  ngOnInit(): void {
    this.newValue=this.oldValue;
    if(this.textarea==undefined){
      this.textarea=false;
    }
  }

  focusIn(){
    this.isEditing=!this.isEditing;
    this.newValue=this.oldValue;
    setTimeout(()=>{
    if(this.textarea){
      this.textAreaFocus.nativeElement.focus();
    }else{
      this.inputFocus.nativeElement.focus();
    }
    
    
    },0)
    
  }

  focusOut(){  
    if(this.newValue!=undefined && this.discardSpaces(this.newValue).length > 0 && this.newValue != this.oldValue){
      this.oldValue="...";      
      this.valueChanged.emit(this.newValue);
      //this.newValue='';  
    }  
    this.isEditing=!this.isEditing
  }

  discardSpaces(val:string):string{
    return `${val.replace(/\s+/g,'')}`;    
  }

}
