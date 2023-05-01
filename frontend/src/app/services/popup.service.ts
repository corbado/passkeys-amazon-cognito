import { Injectable } from '@angular/core';
import { PopupType } from '@corbado/models/popup.model';
import { PostModel } from '@corbado/models/post.model';
import { SpacePage } from '@corbado/models/space-page.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  popupSubject = new BehaviorSubject<PopupType>('');
  popup$ = this.popupSubject.asObservable();

  postData: PostModel | undefined;
  pageData: SpacePage | undefined;

  constructor() {}

  openPopup(type: PopupType, postData?: PostModel): void {
    this.postData = postData;
    this.popupSubject.next(type);
  }

  closePopup(): void {
    this.postData = undefined;
    this.pageData = undefined;
    this.popupSubject.next('');
  }
}
