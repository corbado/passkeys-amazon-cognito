import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SearchItemModel } from '../../../models/search-item.model';
import { UtilsService } from 'src/app/services/utils.service';
import { SearchNofoundModel } from '@corbado/models/search-not-found.model';

@Component({
  selector: 'ho-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Input() size!: { width: string, height: string };
  @Input() searchOptions!: SearchItemModel[];
  @Input() searchNofound!: SearchNofoundModel;
  @Input() showResults!: boolean;
  @Input() exactResultEmittion!: boolean;
  @Input() emitOnFilter!:boolean;
  @Input() emitOnEnter!:boolean;
  @Input() startSearchCharLenght:number=1;
  @Input() placeholderText!: string;
  @Output() outText = new EventEmitter<string>();
  myControl = new FormControl();
  filteredOptions!: Observable<SearchItemModel[]>;
  changesSubscription!: Subscription;
  startFind=false;

  constructor(public utils: UtilsService) { }

  ngOnInit() {
    if (this.showResults == undefined) {
      this.showResults = true;
    }
    if (this.placeholderText == undefined) {
      this.placeholderText = 'Search';
    }
    if (this.exactResultEmittion == undefined) {
      this.exactResultEmittion = true;
    }
    if(this.emitOnEnter == undefined){
      this.emitOnEnter = false;
    }
    if(this.emitOnFilter == undefined){
      this.emitOnFilter = true;
    }
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    if(this.emitOnFilter){
      this.changesSubscription = this.myControl.valueChanges.subscribe((value) => {    
        if (this.exactResultEmittion) {
          if (this.searchOptions.map((values:SearchItemModel)=>values.text).includes(value)){
            this.outText.emit(value);
          }
        } else {
          this.outText.emit(value);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
  }

  emitChangeSelectOption(option: SearchItemModel): void {
    this.outText.emit(option.key ? option.key : option.text);
    this.myControl.setValue("");
  }

  enterEmition(option:string):void{
    if(this.emitOnEnter){
      this.outText.emit(option);
      this.myControl.setValue("");
      this.startFind=true;
    }
  }

  private _filter(value: string): SearchItemModel[] {
    if(value!='' && value !=' ' && value.length>=this.startSearchCharLenght){
      const filterValue = value.toLowerCase();    
      return this.searchOptions.filter(option => option.text.toLowerCase().includes(filterValue));
    }
    return [];
  }

}
