import { ChangeDetectionStrategy, ChangeDetectorRef, Component,EventEmitter,Input,OnInit, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TagModel } from '@corbado/models/tag.model';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ho-tag-search',
  templateUrl: './tag-search.component.html',
  styleUrls: ['./tag-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagSearchComponent implements OnInit {
  
  @Input() size!:{width:string;height:string};
  @Input() placeholder!:string;
  @Input() initTags:TagModel[]=[{value:"hola"}];
  @Input() searchOptions!:string[];
  @Input() removableTags!:boolean;
  @Input() activableTags!:boolean;
  @Output() finalTags:EventEmitter<TagModel[]> = new EventEmitter<TagModel[]>();
  @Output()finalActiveTags:EventEmitter<TagModel[]> = new EventEmitter<TagModel[]>();
  
  isfocus=false;
  inputControl = new FormControl();
  dropdownSubscriber!:Subscription;
  constructor(private cdr: ChangeDetectorRef) {
    this.placeholder="custom search";
    this.removableTags=false;
    this.activableTags=true;
    this.size={
      width:'382px',
      height:'45px'
    }
   }

  ngOnInit(): void {}

  enterEmition(option:string):void{
    if(option.trim().length>0){
      if(option!==''&&!this.initTags.some((tag:TagModel)=>{return tag.value.trim().toLowerCase()==option.trim().toLowerCase()})){
        this.initTags.unshift({value:option,active:true});
        this.inputControl.setValue("");
        this.initTags=this.initTags.slice();
        this.cdr.detectChanges();
      }
    }
  }

  open(dropdown: HTMLElement, input: HTMLElement) {
    if(this.dropdownSubscriber==undefined || this.dropdownSubscriber.closed){
      this.isfocus=true;
      this.dropdownSubscriber = fromEvent(document, 'click')
      .pipe(
        filter(({ target }) => {
          return !(dropdown.contains(target as HTMLElement)||input.contains(target as HTMLElement));
        }),
      )
      .subscribe((result) => {
        this.close();
        this.cdr.detectChanges();
      },
      (err)=>{
        console.error(err);
      });
    }
  }  

  close() {
    if(this.dropdownSubscriber && !this.dropdownSubscriber.closed){      
      this.isfocus=false;
      this.dropdownSubscriber.unsubscribe();
    }
  }
}
