import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { SpaceContent } from '@corbado/models/space.model';
import { DateTimeEntity, PostModel } from '@corbado/models/post.model';
import { CONSTANT } from '@corbado/shared/constants';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicFile, TagModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private params = new HttpParams();
  private previousUrl!: string;
  private currentUrl: string;

  mobileFeedView = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
    if (argument === undefined || argument === null) {
      throw new TypeError(message);
    }
    return argument;
  }

  uploadFile(file: File): Observable<PublicFile> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.put<PublicFile>(`${environment.apiUrl}files`, formData, { params: this.params, withCredentials: false });
  }

  updateFileViewCount(fileID: number) {
    return this.http.put<boolean>(`${environment.apiUrl}files/view`, {fileID});
  }

  loadDefaultImage(text:'default'|'reverseInquiry'='default'): string {
    switch(text){
      case 'default':
        return environment.defaultImg;
      case 'reverseInquiry':
        return environment.defaulttReverseInquiryImage;
      default:
        return environment.defaultImg;
    }    
  }

  sortByProperty(arr: Array<any>, property: string, returnClone: boolean = false, orderByMax: boolean = false) {
    const threshVal = (orderByMax)?-1:1
    if (returnClone) {
      const newVal = [...arr];
      return newVal.sort((a, b) => (a[property] > b[property]) ? threshVal : ((b[property] > a[property]) ? -threshVal : 0));
    } else {
      return arr.sort((a, b) => (a[property] > b[property]) ? threshVal : ((b[property] > a[property]) ? -threshVal : 0));
    }
  }
  transformVideo(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getTextLength(val: 'titles' | 'descriptions'): number {
    return environment.textLength[val];
  }

  parseEuroToFloat(value: string): number {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  }

  parseFloatToEuro(val: number): string {
    return val.toLocaleString();
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }

  public getCustomStyling(authorMail: string): {customView: string, bannerURL: string, logoURL: string} {
    if (authorMail && authorMail.endsWith('@cloudbridge.eu')){
      return {
        customView: 'cloudbrigde',
        bannerURL: environment.development ? CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW_DEV.banner : CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW.banner,
        logoURL: environment.development ? CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW_DEV.logo : CONSTANT.CLOUDBRIDGE_CUSTOM_VIEW.logo,
      }
    } else if (authorMail && authorMail.endsWith('@corbado.com')) {
      return {
        customView: 'corbado',
        bannerURL: environment.development ? CONSTANT.CORBADO_CUSTOM_VIEW_DEV.banner : CONSTANT.CORBADO_CUSTOM_VIEW.banner,
        logoURL: environment.development ? CONSTANT.CORBADO_CUSTOM_VIEW_DEV.logo : CONSTANT.CORBADO_CUSTOM_VIEW.logo,
      }
    } else {
      return {
        customView: '',
        bannerURL: '',
        logoURL: '',
      }
    }
  }

  convertFeedDataToPostElems(feedData: SpaceContent): PostModel[] {
    const elems: PostModel[] = feedData.posts
    .filter((postModel, _i, array) => !array.some((post) => post.id_comments && post.id_comments.includes(postModel.id as number) ))
    .map((postModel) => {
      const foundAuthor = feedData.authors.find((author) => author.id === parseInt(postModel.id_creator + ''));
      return {
        id: postModel.id,
        id_creator: postModel.id_creator,
        content: postModel.content,
        guest_name: postModel.guest_name,
        links: postModel.links,
        files: postModel.id_files?.map((fileID) => feedData.files?.find((file) => file.id === fileID)),
        timestamp: postModel.timestamp,
        id_comments: postModel.id_comments,
        feedID: postModel.feedID,
        reactions_json: postModel.reactions_json,
        index: postModel.index,
        pageID: postModel.pageID,
        link_open_count: postModel.link_open_count,
        postID: postModel.postID,
        title: postModel.title,
        description: postModel.description,
        pinned: postModel.pinned,
        hide_thumbnail: postModel.hide_thumbnail,
        comments: this.convertModelsToElems(feedData, feedData.posts.filter((post) => postModel.id_comments?.includes(post.id as number))),
        author: foundAuthor ? foundAuthor : {id: -1, name: postModel.guest_name ? postModel.guest_name : 'author not found', img: ''} ,
      };
    });
    return elems;
  }

  convertModelsToElems(feedData: SpaceContent, postModels: PostModel[]): PostModel[] {
    const elems: PostModel[] = postModels
    .filter((postModel, _i, array) => !array.some((post) => post.id_comments && post.id_comments.includes(postModel.id as number) ))
    .map((postModel) => {
      const foundAuthor = feedData.authors.find((author) => author.id === parseInt(postModel.id_creator + ''));
      return {
        id: postModel.id,
        id_creator: postModel.id_creator,
        content: postModel.content,
        id_comments: postModel.id_comments,
        links: postModel.links,
        index: postModel.index,
        pageID: postModel.pageID,
        timestamp: postModel.timestamp,
        link_open_count: postModel.link_open_count,
        guest_name: postModel.guest_name,
        title: postModel.title,
        description: postModel.description,
        postID: postModel.postID,
        comments: this.convertModelsToElems(feedData, postModels.filter((post) => postModel.id_comments?.includes(post.id as number))),
        author: foundAuthor ? foundAuthor : {id: -1, name: postModel.guest_name ? postModel.guest_name : 'author not found', img: ''} ,
      };
    });
    return elems;
  }

  compareByTimeStamp(elem1: PostModel, elem2: PostModel): number {
    if (elem1.timestamp && elem2.timestamp) {
      const date1 = new Date(elem1.timestamp.value.replace(" ", "T"));
      const date2 = new Date(elem2.timestamp.value.replace(" ", "T"));
      return date2.valueOf() - date1.valueOf();
    } else {
      return 0;
    }
  }

  compareByTimeStamp2(elem1: any, elem2: any): number {
    if (elem1.pinned && !elem2.pinned) {
      return -1;
    }
    if (!elem1.pinned && elem2.pinned) {
      return 1;
    }
    if (elem1.last_post_timestamp && elem2.last_post_timestamp) {
      const date1 = Date.parse(elem1.last_post_timestamp);
      const date2 = Date.parse(elem2.last_post_timestamp);
      return date2.valueOf() - date1.valueOf();
    } else {
      return 0;
    }
  }

  public getTimingText(timestamp: DateTimeEntity): string {
    const time = this.getTimeFromTimestamp(timestamp);
    let timingText = '-Could not determine time of post-';
    if (time.minutes === 0 && time.hours === 0 && time.days === 0 && time.months === 0) {
      timingText = 'just now';
    } else if (time.minutes === 1) {
      timingText = '1 minute ago';
    } else if (time.minutes > 1 && time.minutes < 61) {
      timingText = time.minutes + ' minutes ago';
    } else if (time.hours === 1) {
      timingText = '1 hour ago';
    } else if (time.hours > 1 && time.hours < 24) {
      timingText = time.hours + ' hours ago';
    } else if (time.days === 1) {
      timingText = '1 day ago';
    } else if (time.days > 1 && time.days < 31) {
      timingText = time.days + ' days ago';
    } else if (time.months === 1) {
      timingText = '1 month ago';
    } else if (time.months > 1) {
      timingText = time.months + ' months ago';
    }
    return timingText;
  }

  public getTimeFromTimestamp(timestamp: DateTimeEntity): {minutes: number, hours: number, days: number, months: number} {
    let minutes = 0, hours = 0, days = 0, months = 0;
    const date = new Date(timestamp.value.replace(" ", "T"));
    // @ts-ignore
    const seconds = Math.floor((new Date() - (date.getTime() + 60*60*2*1000)) / 1000); // have to offset by 2hours in ms because of timezone -> TODO shit solution
    let interval = seconds / 31536000; // number of years
    interval = seconds / 2592000; // number of months
    if (interval > 1) {
      months = Math.floor(interval);
    }
    interval = seconds / 86400; // number of days
    if (interval > 1) {
      days = Math.floor(interval);
    }
    interval = seconds / 3600;
    if (interval > 1) {
      hours = Math.floor(interval)
    }
    interval = seconds / 60;
    if (interval > 1) {
      minutes = Math.floor(interval);
    }
    return {minutes, hours, days, months};
  }

  public tagToText(tags:TagModel[]):string[]{    
    return tags.map((tag:TagModel)=>{return tag.value});
  }

  public str2b64(str:string):string{
    return escape(window.btoa(unescape(encodeURIComponent(str))));
  }

  public b642str(b64:string):string{
    return decodeURIComponent(escape(window.atob(unescape(b64))));
  }

}
