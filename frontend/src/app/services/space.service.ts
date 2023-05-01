import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser } from '@corbado/auth/auth-user';
import { AuthService } from '@corbado/auth/services/auth.service';
import { SpaceContent, SpaceModel, SpaceRights } from '@corbado/models/space.model';
import { LinkViewEvent, PostModel, PostReactionJSON } from '@corbado/models/post.model';
import { SpacePage } from '@corbado/models/space-page.model';
import { UserInfo } from '@corbado/models/user.model';
import { CONSTANT } from '@corbado/shared/constants';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';
import { PopupService } from './popup.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  SPACE_COOKIE = 'corbado-feed';
  PAGE_COOKIE = 'corbado-page';
  defaultSpace: SpaceModel = CONSTANT.DEFAULT_SPACE;
  guestName = '';
  guestMail = '';
  SUCCESS_MS = CONSTANT.DURATION_SUCCESS_NOTIF_MS;
  WARNING_MS = CONSTANT.DURATION_WARNING_NOTIF_MS;
  isPosting = false;

  postEditSubject = new Subject<PostModel>();
  postEdit$ = this.postEditSubject.asObservable();
  spaceDuplicateSubject = new Subject<null>();
  spaceDuplicate$ = this.spaceDuplicateSubject.asObservable();
  spacesSubject = new BehaviorSubject<SpaceModel[]>([]);
  spaces$ = this.spacesSubject.asObservable();
  spaceSubject = new BehaviorSubject<SpaceModel>(this.defaultSpace);
  space$ = this.spaceSubject.asObservable();
  currentSpaceUUIDSubject = new BehaviorSubject<string>('');
  currentSpaceUUID$ = this.currentSpaceUUIDSubject.asObservable();
  editSpaceTitleSubject = new Subject<null>();
  editSpaceTitle$ = this.editSpaceTitleSubject.asObservable();
  pageUUIDSubject = new BehaviorSubject<string>('');
  pageUUID$ = this.pageUUIDSubject.asObservable();

  guestView = false;
  visData: {customView: string, bannerURL: string, logoURL: string} | undefined;
  refreshSpaces$ = new Observable();

  spaceUUIDToAdd: string = '';
  
  constructor(
    private auth: AuthService,
    private utils: UtilsService,
    private http: HttpClient,
    private notif: NotificationService,
    private popupService: PopupService,
    private cookieService: CookieService,
  ) {
    this.loadFeedCookie();
    if (!this.auth.isAuth()) this.loadGuestData();
  }

  async getSpaces(newSpaceUUID?: string): Promise<void> {
    // If adding a space to spaces
    const spaceUUID = newSpaceUUID ? newSpaceUUID : '';
    if (spaceUUID) this.currentSpaceUUIDSubject.next(spaceUUID);

    if (this.auth.isAuth()) {
      let spaces = await this.http.get<SpaceModel[]>(`${environment.apiUrl}spaces/${spaceUUID}`).toPromise();

      if (spaces.some(f => f.password_protected)) {
        console.log('Requesting password');
        const foundIndex = spaces.findIndex(f => f.password_protected);
        spaces.splice(foundIndex, 1);
        this.spaceUUIDToAdd = spaceUUID;
        this.popupService.openPopup('request-password');
      }

      if (!spaces)  spaces = [];
      spaces.sort((space1, space2) => this.utils.compareByTimeStamp2(space1, space2));
      this.updateFeedDisplay(spaces, newSpaceUUID ? newSpaceUUID : this.currentSpaceUUIDSubject.value);
      this.spacesSubject.next(spaces);
    } else {
      console.log('Getting single feed for guest');
      this.http.get<SpaceModel>(`${environment.apiUrl}spaces/${spaceUUID}`).subscribe(answer => {
        if (answer.password_protected) {
          console.log('Requesting password');
          this.spaceUUIDToAdd = spaceUUID;
          this.popupService.openPopup('request-password');
        } else {
          this.processSpaceForGuest(answer);
        }
      });
    }
  }

  processSpaceForGuest(space: SpaceModel): void {
    space.posts.sort((post1, post2) => this.utils.compareByTimeStamp(post1, post2));
    space.guestView = true;

    if (space.posts.some(p => (!p.pageID && !p.content))) {
      this.oldSpace = true;
      const defaultContentPage: SpacePage = {
        pageID: 'defaultContentPage',
        name: 'Content Page',
        type: 'content',
        title: space.content_title,
      }
      space.posts.forEach(p => {
        if (!p.pageID && !p.content) p.pageID = defaultContentPage.pageID;
      });
      if (!space.pages) space.pages = [];
      // @ts-ignore
      space.pages.unshift(defaultContentPage);
    }

    if (space.pages && (!this.pageUUIDSubject.value || !space.pages.some(p => p.pageID === this.pageUUIDSubject.value))) {
      this.pageUUIDSubject.next(space.pages[0].pageID);
    }

    if (space.creator && space.creator.email && this.utils.getCustomStyling(space.creator.email).customView) {
      this.visData = this.utils.getCustomStyling(space.creator.email);
      if (this.visData.customView) space.visData = this.visData;
    }
    this.guestView = true;
    this.spacesSubject.next([space]);
    this.spaceSubject.next(space);
  }

  async createNewFeed(): Promise<void> {
    const data = {userUUID: this.auth.getUser().userID};
    const feeds = await this.http.post<SpaceModel[]>(`${environment.apiUrl}spaces`, data).toPromise();
    feeds.sort((feed1, feed2) => this.utils.compareByTimeStamp2(feed1, feed2));
    this.spacesSubject.next(feeds);
    const newFeed = feeds.find(feed => feed.new);
    if (newFeed) {
      this.notif.stopNotification();
      this.changeFeed(newFeed.feedID);
      if (newFeed.pages) {
        this.pageUUIDSubject.next(newFeed.pages[0].pageID);
      }
    } else {
      this.notif.showNotification('There was a problem creating a new space, please reload the page and try again.', 'warning', 3000);
    }
  }

  changeFeed(uuid: string): void {
    if (!uuid && this.spacesSubject.value.length > 0) uuid = this.spacesSubject.value[0].feedID;
    this.currentSpaceUUIDSubject.next(uuid);
    this.updateFeedDisplay(this.spacesSubject.value, uuid);
    this.saveFeedCookie(uuid);
  }

  async updateFeedDisplay(feeds: SpaceModel[], feedUUID: string, force = false): Promise<void> {
    if (feeds.length === 0) {
      this.spaceSubject.next(this.defaultSpace);
      return;
    }
    const foundIndex = feeds.findIndex(f => f.feedID === feedUUID);
    const index = (foundIndex + 1) ? foundIndex : 0;

    if ((feeds[index] && !feeds[index].posts && !feeds[index].new) || force) {
      const feedContent = await this.http.get<SpaceContent>(`${environment.apiUrl}posts/${feeds[index].feedID}`).toPromise();
      const posts = this.utils.convertFeedDataToPostElems(feedContent);
      posts.sort((post1, post2) => this.utils.compareByTimeStamp(post1, post2));
      feeds[index].posts = posts;

      if (posts.some(p => (!p.pageID && !p.content))) {
        this.oldSpace = true;
        const defaultContentPage: SpacePage = {
          pageID: 'defaultContentPage',
          name: 'Content Page',
          type: 'content',
          title: feeds[index].content_title,
        }
        feeds[index].posts.forEach(p => {
          if (!p.pageID && !p.content) p.pageID = defaultContentPage.pageID;
        });
        if (!feeds[index].pages) feeds[index].pages = [];
        // @ts-ignore
        feeds[index].pages.unshift(defaultContentPage);
      }

    }

    this.spaceSubject.next(feeds[index]);

    const pages = feeds[index].pages;
    if (pages) {
      const foundIndex = pages.findIndex(p => p.pageID === this.pageUUIDSubject.value);
      if (this.pageUUIDSubject.value && foundIndex > -1) {
        this.pageUUIDSubject.next(pages[foundIndex].pageID);
      }
      else {
        if (pages[0]) this.changePage(pages[0].pageID);
        else this.changePage('');
        
      }
    }
  }
  oldSpace = false;

  duplicateSpace(space: SpaceModel): void {
    this.http.post<SpaceModel[]>(`${environment.apiUrl}spaces/duplicate`, space).subscribe((spaces: SpaceModel[]) => {
      if (!spaces)  spaces = [];
      spaces.sort((space1, space2) => this.utils.compareByTimeStamp2(space1, space2));
      this.spacesSubject.next(spaces);
      const duplicateSpace = spaces.find(s => s.isDuplicate)
      if (duplicateSpace) this.changeFeed(duplicateSpace.feedID);
      this.notif.stopNotification();
    });
  }

  saveFeedCookie(spaceUUID: string, pageUUID?: string): void {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const options: CookieOptions = {
      expires: expiryDate.toUTCString(),
    };
    this.cookieService.putObject(this.SPACE_COOKIE, {feedUUID: spaceUUID}, options);
  }

  loadFeedCookie() {
    let spaceCookieValue = this.cookieService.getObject(this.SPACE_COOKIE);
    let pageCookieValue = this.cookieService.getObject(this.PAGE_COOKIE);
    // @ts-ignore
    if (spaceCookieValue && spaceCookieValue.feedUUID) this.currentSpaceUUIDSubject.next(spaceCookieValue.feedUUID);
    // @ts-ignore
    if (pageCookieValue && pageCookieValue.pageUUID) this.pageUUIDSubject.next(pageCookieValue.pageUUID);
  }

  getNumberOfSpaces(): number {
    return this.spacesSubject.value.length;
  }

  updateSpace(space: SpaceModel): Observable<number[]> {
    // return this.http.put<number[]>(`${environment.apiUrl}users/${this.auth.getUserID()}/spaces`, space);
    return this.http.put<number[]>(`${environment.apiUrl}spaces`, space);
  }

  editPost(post: PostModel) {
    const currentFeed = this.spaceSubject.value;
    const postIndex = currentFeed.posts.findIndex(p => p.id == post.id);
    if (postIndex >= 0) {
      this.http.put<number[]>(`${environment.apiUrl}posts/`, post).subscribe((res: number[]) => {
        if (res[0] === 1) {
          currentFeed.posts[postIndex] = post;
          this.popupService.closePopup();
          this.notif.stopNotification();
          // this.feedSubject.next(currentFeed);
          // this.updateFeedDisplay(this.feedsSubject.value, this.feedSubject.value.feedID, true);
        } else {
          this.notif.showNotification('There was a problem editing your post. Please reload and try again.', 'warning', this.WARNING_MS);
        }
      });
    }
  }

  currentUserIsFeedAdmin(): boolean {
    return this.spaceSubject.value.id_creator == this.auth.getUserID();
  }

  currentUserHasEditRights(): boolean {
    if (
      (this.auth.isAuth() && this.spaceSubject.value.id_creator === this.auth.getUserID()) ||
      (this.auth.isAuth() && this.spaceSubject.value && (this.spaceSubject.value.id_creator === this.auth.getUserID() || 
        (this.spaceSubject.value.author?.company && this.auth.getUser().company && this.spaceSubject.value.author?.company?.id === this.auth.getUser().company.id))
      )
    ) {
      return true;
    }
    return false;
  }

  async uploadPost(post: PostModel) {
    if (this.isPosting) {
      console.log('wait...');
      return;
    }
    this.isPosting = true;
    const currentSpace = this.spaceSubject.value;
    const spaceUUID = currentSpace.feedID;
    post.feedID = spaceUUID;
    let payload: any;
    let path = '';

    if (this.auth.isAuth()) { // Adding post as user
      const user: AuthUser = this.auth.getUser();
      payload = {post: post, spaceUUID: spaceUUID, authorName: user.fullname, authorMail: user.email, authorID: user.id};
      path = 'posts';
    } else {
      post.guest_name = this.guestName;
      post.guest_mail = this.guestMail;
      post.author = { name: this.guestName, email: this.guestMail };
      payload = {post, feedID: spaceUUID};
      path = 'posts/guest';
    }

    const newPost = await this.http.post<PostModel>(`${environment.apiUrl}${path}`, payload).toPromise();

    if (newPost && newPost.id) { // Successful post upload
      if (this.auth.isAuth()) { // only for posts as user
        newPost.author = this.auth.getUserAsAuthor();
        currentSpace.id_posts.push(parseInt(newPost.id + ''));
      } else {
        newPost.author = {name: this.guestName};
      }

      if (!currentSpace.posts) currentSpace.posts = [newPost];
      else currentSpace.posts.unshift(newPost);

      const pushFeed = Object.assign(currentSpace);
      this.spaceSubject.next(pushFeed);
      // ugly reload of the page, we change it to nothing then back to its original value
      const currentPageUUID = this.pageUUIDSubject.value;
      this.pageUUIDSubject.next('');
      this.pageUUIDSubject.next(currentPageUUID);

      this.popupService.closePopup();
      this.notif.showNotification('Post successfully added', 'success', this.SUCCESS_MS);
    } else { // Failed post upload
      this.editPostRequest(post);
      this.notif.showNotification('Problem posting your content. Save it and try again, if the problem persists contact the corbado team.', 'warning', this.WARNING_MS);
    }
    this.isPosting = false;
  }

  updatePost(post: PostModel): Observable<PostModel> {
    return this.http.put<PostModel>(`${environment.apiUrl}posts/`, post);
  }

  updateContent(content: PostModel[]): Observable<PostModel[]> {
    return this.http.put<PostModel[]>(`${environment.apiUrl}posts/content`, content);
  }

  editPostRequest(post: PostModel): void {
    this.postEditSubject.next(post);
  }

  removePost(id: number): void {
    const currentFeed = this.spaceSubject.value;
    const foundIdIndex = currentFeed.id_posts.findIndex(i => i == id);
    const foundOrderedIndex = currentFeed.posts_order?.findIndex(i => i == id);
    const foundPostIndex = currentFeed.posts.findIndex(i => i.id == id);
    if (foundIdIndex > -1) {
      currentFeed.id_posts.splice(foundIdIndex, 1);
    }
    if (foundOrderedIndex && foundOrderedIndex > -1) {
      currentFeed.posts_order?.splice(foundOrderedIndex, 1);
    }
    if (foundPostIndex > -1 ) {
      currentFeed.posts.splice(foundPostIndex, 1);
    }
    this.http.put<SpaceModel>(`${environment.apiUrl}users/${this.auth.getUserID()}/spaces`, currentFeed).subscribe(res => {
      if (res) {
        this.spaceSubject.next(currentFeed);
        this.http.delete<boolean>(`${environment.apiUrl}posts/${id}`).subscribe(res => {
          if (res) this.notif.showNotification('Post successfully removed', 'success', this.SUCCESS_MS);
        });
      }
    });
  }

  async addComment(comment: PostModel, postID: string) {
    const spaceUUID = this.spaceSubject.value.feedID;
    const authorMail = this.auth.getUser().email;
    const authorName = this.auth.getUser().fullname;
    const newComment = await this.http.post<PostModel>(`${environment.apiUrl}posts/${postID}`, {comment, spaceUUID, authorMail, authorName}).toPromise();
    if (newComment) {
      this.notif.stopNotification();
      return true;
    } else {
      this.notif.showNotification('There was a problem uploading your comment. Plsease Reload and try again.', 'warning', this.WARNING_MS);
      this.updateFeedDisplay(this.spacesSubject.value, this.spaceSubject.value.feedID, true);
      return false;
    }
  }

  addCommentAsGuest(comment: PostModel, postID: string) {
    if (!this.guestName) {
      comment.parent_postID = postID;
      this.popupService.openPopup('guest-name', comment);
      return;
    }
    comment.guest_name = this.guestName;
    comment.guest_mail = this.guestMail;
    comment.author = {id: -1, name: this.guestName, email: this.guestMail};
    const feedUUID = this.spaceSubject.value.feedID;
    if (comment.id_comments && comment.id_comments.length > 0) {
      comment.id_comments = [];
    }
    const post = this.spaceSubject.value.posts.find(p => p.postID === postID);
    post?.comments?.push(comment);
    this.spaceSubject.next(this.spaceSubject.value);
    this.popupService.closePopup();
    this.http.post<PostModel>(`${environment.apiUrl}posts/${postID}/guest`, {comment, feedUUID}).subscribe(res => {
      if (res) {
        console.log('Comment posted');
        this.notif.stopNotification();
      }
    });
  }

  deleteComment(id: number): Observable<boolean> { // TODO check if the post is deleted from the DB, not just from id_comments
    return this.http.delete<boolean>(`${environment.apiUrl}posts/${id}`);
  }

  loadGuestData(): void {
    const foundGuestName = localStorage.getItem('corbadoGuestName');
    const foundGuestMail = localStorage.getItem('corbadoGuestMail');
    if(foundGuestName) {
      this.guestName = foundGuestName;
      console.log('Recognized as guest with name: ', this.guestName);
    }
    if(foundGuestMail) {
      this.guestMail = foundGuestMail;
      console.log('Recognized as guest with mail: ', this.guestMail);
    }
  }

  setGuestData(name: string, mail: string): void {
    this.guestName = name;
    this.guestMail = mail;
    localStorage.setItem('corbadoGuestName', this.guestName);
    localStorage.setItem('corbadoGuestMail', this.guestMail);
  }

  getLinkPreviewData(url: string): Observable<any> {
    return this.http.post<PostModel>(`${environment.apiUrl}posts/link`, {url});
  }

  updateLinkOpenCount(linkViewEvent: LinkViewEvent): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}posts/link`, linkViewEvent);
  }

  updateFeedRights(feedID: number, rights: SpaceRights): Observable<SpaceModel> {
    return this.http.put<SpaceModel>(`${environment.apiUrl}spaces/rights/${feedID}`, {rights});
  }

  updateFeedPassword(feedID: number, password: string): Observable<SpaceModel> {
    return this.http.put<SpaceModel>(`${environment.apiUrl}spaces/password/${feedID}`, {password});
  }

  sendPassword(password: string): void {
    if (this.spaceUUIDToAdd && password) {
      if (this.auth.isAuth()) {
        this.http.put<SpaceModel[]>(`${environment.apiUrl}spaces/${this.spaceUUIDToAdd}`, {password}).subscribe(feeds => {
          feeds.sort((feed1, feed2) => this.utils.compareByTimeStamp2(feed1, feed2));
          this.updateFeedDisplay(feeds, this.spaceUUIDToAdd);
          this.spacesSubject.next(feeds);
          this.popupService.closePopup();
        });
      } else {
        this.http.put<SpaceModel>(`${environment.apiUrl}spaces/${this.spaceUUIDToAdd}`, {password}).subscribe(res => {
          this.processSpaceForGuest(res);
          this.popupService.closePopup();
        });
      }
    }
  }

  updateReactions(postID: number, reactions: PostReactionJSON): Observable<PostModel> {
    return this.http.put<PostModel>(`${environment.apiUrl}posts/reac/${postID}`, {like: reactions.like, celebrate: reactions.celebrate});
  }

  addMailToNotifs(feedUUID: string, email: string): Observable<boolean> {
    return this.http.put<boolean>(`${environment.apiUrl}spaces/notif/${feedUUID}`, {email});
  }

  removeMailFromNotifs(feedUUID: string, email: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}spaces/notif/${feedUUID}/${email}`);
  }

  pinPost(id: number): void {
    const currentFeed = this.spaceSubject.value;
    const index = currentFeed.posts.findIndex(p => p.id == id);
    if (index >= 0) {
      currentFeed.posts[index].pinned = !currentFeed.posts[index].pinned;
      this.spaceSubject.next(currentFeed);
      this.http.post<PostModel>(`${environment.apiUrl}posts/pin/${id}`, {id}).subscribe(res => {
        if (!res) {
          currentFeed.posts[index].pinned = !currentFeed.posts[index].pinned;
          this.spaceSubject.next(currentFeed);
        }
      });
    }
  }

  async deleteFeed(uuid?: string): Promise<void> {
    const feeds = this.spacesSubject.value;
    const targetFeedUUID = uuid ? uuid : this.currentSpaceUUIDSubject.value;
    let targetFeedIndex = feeds.findIndex(f => f.feedID === uuid);
    const removedFeed = feeds.splice(targetFeedIndex, 1);
    this.spacesSubject.next(feeds);
    const success = await this.http.delete<boolean>(`${environment.apiUrl}spaces/${targetFeedUUID}`).toPromise();
    if (success) {
      this.notif.showNotification('Feed removed', 'success', this.SUCCESS_MS);
    } else {
      feeds.splice(targetFeedIndex, 0, ...removedFeed);
      this.spacesSubject.next(feeds);
      this.spaceSubject.next(removedFeed[0]);
      this.notif.showNotification('Something went wrong, if it persists contact the corbado team', 'warning', this.WARNING_MS);
    }
  }

  removeFeed(feedUUID: string): void {
    this.http.delete<boolean>(`${environment.apiUrl}spaces/${feedUUID}`).subscribe(_res => console.log('deleted'));
  }

  changePage(pageUUID: string) {
    this.pageUUIDSubject.next(pageUUID);
    this.savePageCookie(pageUUID);
  }

  async createPage(createPageReq: any) {

    if (!this.spaceSubject.value.pages) this.spaceSubject.value.pages = [];

    const index = this.spaceSubject.value.pages.length;
    for (let i = 0; i < index; i++) {
      if (this.spaceSubject.value.pages[i] && this.spaceSubject.value.pages[i].index !== i) {
        console.log('NEED TO UPDATE INDEX');
        const pageUpdate = this.spaceSubject.value.pages[i];
        pageUpdate.index = i;
        const answer = await this.updatePage(pageUpdate).toPromise();
        if (answer) console.log('Update of page index');
      }
    }
    const newPage: SpacePage = {
      name: createPageReq.name,
      title: '',
      type: createPageReq.type,
      uuid_users: createPageReq.uuid_users,
      pageID: '',
      index: index,
    };
    if (this.spaceSubject.value.id) {
      const space_id = this.spaceSubject.value.id;
      const answer: SpacePage = await this.http.post<any>(`${environment.apiUrl}spacePages/${space_id}`, newPage).toPromise();
      if (answer) {
        this.spaceSubject.value.pages.push(answer);
        this.popupService.closePopup();
        this.notif.stopNotification();
        this.pageUUIDSubject.next(answer.pageID);
      } else {
        this.notif.showNotification('Something went wrong. Please try again or contact the Hæppie Team if the problem persists', 'warning', 3000);
      }
    }
  }

  addTeamMembersToPage(usersUUID: string[]) {
    const page = this.spaceSubject.value.pages?.find(p => p.pageID === this.pageUUIDSubject.value);
    if (page) {
      page.uuid_users = usersUUID;
      this.updatePage(page).subscribe(_answer => {
        this.popupService.closePopup();
        this.pageUUIDSubject.next(page.pageID);
        this.notif.stopNotification();
      })
    } else {
      this.notif.showNotification('Something went wrong. Please try again or contact the Hæppie Team if the problem persists', 'warning', 3000);
    }
  }

  updatePage(page: SpacePage) {
    return this.http.put<number[]>(`${environment.apiUrl}spacePages`, page);
  }

  async deletePage(pageID: string) {
    const pages = this.spaceSubject.value.pages ? this.spaceSubject.value.pages : [];
    const foundIndex = pages.findIndex(p => p.pageID === pageID);
    if (foundIndex >= 0) {
      const answer = await this.http.delete<boolean>(`${environment.apiUrl}spacePages/${pageID}`).toPromise();
      if (answer) {
        this.notif.showNotification('Page deleted successfully', 'success', 3000);
        pages.splice(foundIndex);
        if (pages.length > 0) {
          let newPageUUID = pages[0].pageID;
          // ToDo
          this.pageUUIDSubject.next(newPageUUID);
        } else {
          this.pageUUIDSubject.next('');
        }
      }
    }
  }

  getCurrentPage(): SpacePage | undefined {
    return this.spaceSubject.value.pages?.find(p => p.pageID === this.pageUUIDSubject.value);
  }

  getCurrentPageContentLength() {
    const currentPage = this.getCurrentPage();
    if (currentPage) {
      return this.spaceSubject.value.posts.filter(p => p.pageID === currentPage.pageID).length;
    } else {
      return 0;
    }
  }

  getTeamPage(pageID: string): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${environment.apiUrl}spacePages/team/${pageID}`);
  }

  savePageCookie(pageUUID: string): void {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const options: CookieOptions = {
      expires: expiryDate.toUTCString(),
    };
    this.cookieService.putObject(this.PAGE_COOKIE, {pageUUID}, options);
  }

  isDefaultSpace(): boolean {
    if (!this.spaceSubject.value) return true;
    return this.spaceSubject.value.id === -1 && this.spaceSubject.value.id_creator === -1;
  }

  canPost(): boolean {
    // can post if 1. is auth and owner of space, 2
    if (!this.auth.isAuth() && this.spaceSubject.value.rights === 'none') return false
    else return true;
  }

  async pinSpace(spaceUUID: string) {
    const spaces = this.spacesSubject.value;
    const space = spaces.find(f => f.feedID === spaceUUID);
    if (space) {
      space.pinned = !space.pinned;
      spaces.sort((space1, space2) => this.utils.compareByTimeStamp2(space1, space2));
      const pinned = await this.http.put<boolean>(`${environment.apiUrl}spaces/pin/${spaceUUID}`, {}).toPromise();
      space.pinned = pinned;
    }
  }
}
