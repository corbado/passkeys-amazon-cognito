import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TagModel } from '@corbado/models/index';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'ho-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit, OnChanges {
  @Input() tagList:TagModel[]=[];
  @Input() activable!:boolean;
  @Input() activeLimit!:number;
  @Input() removable!:boolean;
  @Output() activeList: EventEmitter<TagModel[]> = new EventEmitter<TagModel[]>();
  @Output() changes: EventEmitter<TagModel[]> = new EventEmitter<TagModel[]>();

  constructor(private notificationService:NotificationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.emitList();
  }

  ngOnInit(): void {
    if(this.activable==undefined){
      this.activable=false;    }
    if(this.removable==undefined){
      this.removable=false;
    }
    this.emitList();
  }

  change(tag:TagModel){
    if(this.activeLimit){      
      if(this.tagList.filter((chip:TagModel)=>chip.active).length<this.activeLimit || tag.active){
        tag.active=!tag.active;
      }else{
        this.notificationService.showNotification(`Tag Limit : ${this.activeLimit}`,'warning',2000);
      }
    }else{
      tag.active=!tag.active;
    }
    this.emitList();
    
  }
  removeFromList(index:number){
    this.tagList.splice(index,1);
    this.emitList();
  }

  emitList(){
    if(this.activable){
      this.activeList.emit(this.tagList.filter((chip:TagModel)=>chip.active));
    }
    this.changes.emit(this.tagList);
  }

}
