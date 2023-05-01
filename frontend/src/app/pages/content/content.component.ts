import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges, EventEmitter, Output, HostListener } from '@angular/core';
import { ContentType, PostModel, PostReaction } from '@corbado/models/post.model';
import { SpaceService } from 'src/app/services/space.service';
import { AuthService } from '@corbado/auth/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupService } from 'src/app/services/popup.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CONSTANT } from '@corbado/shared/constants';



@Component({
  selector: 'ho-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, OnChanges {

  @Input() post: PostModel = CONSTANT.DEFAULT_POST;
  @Input() enableAnalytics = false;
  @Input() canPost = true;
  @Input() guest = false;
  @Input() guestReactions: { postID: string, like: boolean, celebrate: boolean }[] = [];

  @Output() movePostReq = new EventEmitter<{ direction: number, objectID: string, type: string }>()

  @ViewChild('commentWriterRef') commentWriterRef: ElementRef | undefined;

  commentsDisplayed = false;
  transitionTime = '.2s';
  commentsStyle = {};
  commentEditIndex = -1;
  numberOfViews = 0;
  hasAnalytics = false;
  menuOpen = false;
  safeLink: SafeResourceUrl = '';
  contentType: ContentType = '';

  constructor(
    public utils: UtilsService,
    public auth: AuthService,
    public spaceService: SpaceService,
    private sanitizer: DomSanitizer,
    private feedService: SpaceService,
    private popupService: PopupService,
    private notif: NotificationService,
  ) { }

  ngOnInit(): void {
    if (this.post.comments) {
      this.post.comments.sort((c1, c2) => this.utils.compareByTimeStamp(c2, c1));
    }
    if (this.post.files && this.post.files[0]) {
      const fileData = this.post.files[0];
      if (
        fileData.name?.endsWith(".png") ||
        fileData.name?.endsWith(".PNG") ||
        fileData.name?.endsWith(".jpg") ||
        fileData.name?.endsWith(".JPG") ||
        fileData.name?.endsWith(".gif") ||
        fileData.name?.endsWith(".jpeg") ||
        fileData.name?.endsWith(".JPEG")) {
        this.contentType = 'img';
      } else if (
        fileData.name?.endsWith(".pdf") ||
        fileData.name?.endsWith(".PDF")) {
        this.contentType = 'pdf';
        this.numberOfViews = this.post.files[0].view_count;
      }
    } else if (this.post.links && this.post.links[0]) {
      const link = this.post.links[0];
      this.contentType = 'website';
      this.numberOfViews = this.post.link_open_count;
      // Regex for youtube
      var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (link.match(p)) {
        // YouTube
        this.contentType = 'youtube';
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link.replace("watch?v=", "embed/"));
      } else if (link.match('loom.com')) {
        // Loom
        this.contentType = 'loom';
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link.replace("/share/", "/embed/"));
      } else if (link.match('miro.com')) {
        this.contentType = 'miro';
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link.replace("/board/", "/live-embed/"));
      } else if (link.match('vidyard.com')) {
        // Others
        this.contentType = 'vidyard';
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      } else if (link.match('pitch.com')) {
        this.contentType = 'pitch';
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      }
    }

    if (this.post.links && this.post.links.length > 0 && this.isVideo()) {
      //watch?v=
      if ((this.post.links[0] as string).match("watch")) {
        // YouTube
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.post.links[0].replace("watch?v=", "embed/"));
      } else if (this.post.links[0].match('/share/')) {
        // Loom
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.post.links[0].replace("/share/", "/embed/"));
      } else {
        // Others
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.post.links[0]);
      }
    } else if (this.post.links && this.post.links.length > 0 && this.isPitch()) { // pitch
      if (this.post.links[0].match('/public/')) {
        this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.post.links[0].replace("/public/", "/embed/"));
      }
    } else if (this.post.links && this.post.links.length > 0 && this.isMiro()) { // miro
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.post.links[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const post = changes.post?.currentValue;
    if (post && ((post.files && post.files.length > 0 && post.files[0].name.endsWith('.pdf')) || (post.links && post.links.length > 0 && post.links_view_log))) {
      this.hasAnalytics = true;
      if (post.files && post.files[0]) {
        this.numberOfViews = post.files[0].view_log?.length;
      } else {
        this.numberOfViews = post.links_view_log?.length;
      }
    }
  }

  getContentType(name?: string): string {
    if (!name) return '';
    if (
      name.endsWith(".png") ||
      name.endsWith(".PNG") ||
      name.endsWith(".jpg") ||
      name.endsWith(".JPG") ||
      name.endsWith(".gif") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".JPEG")
    ) {
      return 'img';
    } else if (name.endsWith(".pdf") || name.endsWith(".PDF")) {
      return 'pdf';
    } else return '';
  }

  openPostEditMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  @HostListener('document:mouseup', ['$event.target'])
  onMouseUpHandler(target: HTMLElement) {
    if (target.className !== 'ci-More_Horizontal')
      this.menuOpen = false;
  }

  @HostListener('document:mousedown', ['$event.target'])
  onMouseDownHandler(target: HTMLElement) {
    if (!target.closest('.popup-container.create-post') && !this.menuOpen && target.className === 'spaces-popup-container')
      //console.log(target.className)
      this.popupService.closePopup();

  }







  isVideo(): boolean {
    if (this.post.links && this.post.links[0]) {
      const link = this.post.links[0];
      var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (link.match(p)) {
        return true;
      } else if (
        link.startsWith('www.loom.com/') ||
        link.startsWith('https://www.loom.com/') ||
        link.startsWith('loom.com/') ||
        link.startsWith('https://loom.com/') ||
        link.startsWith('https://share.vidyard.com')
      ) return true;
    }
    return false;
  }

  isPdf(): boolean {
    if (this.post.files && this.post.files[0] && (this.post.files[0].name.endsWith('pdf') || this.post.files[0].name.endsWith('PDF'))) {
      return true;
    }
    return false;
  }

  isPitch(): boolean {
    if (this.post.links && this.post.links.length > 0 && this.post.links[0].match('pitch.com')) {
      return true;
    }
    return false;
  }

  isMiro(): boolean {
    if (this.post.links && this.post.links.length > 0 && this.post.links[0].match('miro.com')) {
      return true;
    }
    return false;
  }

  sanitizeLink(link: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  openCommentEditMenu(index: number): void {
    if (this.commentEditIndex === index) {
      this.commentEditIndex = -1;
    } else {
      this.commentEditIndex = index;
    }
  }

  async postComment() {
    setTimeout(() => {
      if (this.commentWriterRef) this.commentWriterRef.nativeElement.value = '';
      this.autogrow()
    }, 200); // should be at the end of the function when the issue is fixed (Error 500)
    if (this.canPost && this.commentWriterRef?.nativeElement.value) {
      const newComment: PostModel = {
        id_creator: -1,
        index: 0, //TODO
        link_open_count: 0,
        feedID: this.spaceService.currentSpaceUUIDSubject.value,
        content: this.commentWriterRef?.nativeElement.value,
      }
      if (this.auth.isAuth() && this.post.postID) {
        newComment.author = this.auth.getUserAsAuthor();
        newComment.id_creator = parseInt(this.auth.getUserID() + '');
        this.post.comments?.push(newComment);
        const success = await this.feedService.addComment(newComment, this.post.postID);
        if (success) {
          this.commentWriterRef.nativeElement.value = '';
        }
      } else {
        this.feedService.addCommentAsGuest(newComment, this.post.postID ? this.post.postID : '');
      }
    }
  }

  toggleCommentSection(): void {
    if (!this.commentsDisplayed) {
      this.commentsDisplayed = true;
      // TODO find way to compute height in advance
      this.commentsStyle = { height: "fit-content", transition: `height ${this.transitionTime}`, padding: '8px' };
    } else {
      this.commentsDisplayed = false;
      this.commentsStyle = { height: "0px", transition: `height ${this.transitionTime}`, padding: '0px' };
    }
  }

  onLinkClicked(link: string): void {
    this.feedService.updateLinkOpenCount({ postID: parseInt(this.post.id + ''), link }).subscribe((_res) => this.notif.stopNotification());
  }

  getContentHTML(stringContent: string) {
    let content = stringContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    content = content.replace(exp, "<a href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    content = content.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
    return content;
  }

  updateReactions(type: PostReaction): void {
    let reactions: { like: number[], celebrate: number[] } = { like: [], celebrate: [] };
    if (this.post.reactions_json) {
      reactions = this.post.reactions_json;
    }
    const userID = this.guest ? 0 : parseInt(this.auth.getUserID() + '');
    if (userID) {
      // User reaction
      const foundIndex = reactions[type].findIndex((id) => id === userID);
      if (foundIndex >= 0) {
        reactions[type].splice(foundIndex, 1);
      } else {
        (reactions[type] as number[]).push(userID);
      }
      this.feedService.updateReactions(parseInt(this.post.id + ''), reactions).subscribe((_res) => this.post.reactions_json = reactions);
    } else {
      //  Guest reaction
      if (this.hasReacted(type)) {
        // remove from reactions in DB and in session
        let foundIndex = reactions[type].findIndex(id => id == 0);
        reactions[type].splice(foundIndex, 1);
        foundIndex = this.guestReactions.findIndex(reac => reac.postID === this.post.postID);
        this.guestReactions[foundIndex][type] = false;
      } else {
        (reactions[type] as number[]).push(0);
        let foundIndex = this.guestReactions.findIndex(reac => reac.postID === this.post.postID);
        if (foundIndex > -1) this.guestReactions[foundIndex][type] = true;
        else {
          const newReac = { postID: this.post.postID ? this.post.postID : '', like: false, celebrate: false };
          newReac[type] = true;
          this.guestReactions.push(newReac);
        }
      }
      localStorage.setItem('corbadoGuestReactions', JSON.stringify(this.guestReactions));
      this.feedService.updateReactions(parseInt(this.post.id + ''), reactions).subscribe((_res) => this.post.reactions_json = reactions);
    }
  }

  hasReacted(type: PostReaction): boolean {
    if (this.guest) {
      return this.guestReactions.some(reac => reac.postID === this.post.postID && reac[type]);
    } else {
      if (this.post.reactions_json) return !!this.post.reactions_json[type].includes(parseInt(this.auth.getUserID() + '')); //double negation to convert undefined
      else return false;
    }
  }

  deletePostReq(id: any): void {
    if (id) {
      this.feedService.removePost(id);
    }
  }

  editPostReq(): void {
    this.menuOpen = false;
    this.popupService.openPopup('share-content', this.post);
  }

  openContent(): void {
    if (this.post.links && this.post.links[0]) {
      this.onLinkClicked(this.post.links[0]);
      window.open(this.post.links[0], "_blank");
    } else if (this.post.files && this.post.files[0] && this.post.files[0].url) {
      if (this.post.files[0].name.endsWith('pdf') || this.post.files[0].name.endsWith('PDF')) {
        window.open(this.post.files[0].url.slice(0, -8) + 'pdf', "_blank");
      }
    }
  }

  pinPostReq(id: any): void {
    this.feedService.pinPost(id);
  }

  movePost(direction: number): void {
    if (this.post.postID) {
      this.movePostReq.emit({ direction: direction, objectID: this.post.postID, type: 'content' });
    }
  }

  deleteCommentReq(id: any) {
    if (id && this.post.comments) {
      const commentIndex = this.post.comments?.findIndex(c => c.id == id);
      const commment = this.post.comments.splice(commentIndex, 1);
      this.feedService.deleteComment(id).subscribe(res => {
        this.notif.showNotification("Comment removed successfully.", "success", 1000);
      });
    }
  }

  editCommentReq(id: any) {
    // TODO
  }

  autogrow() {
    // TODO
    const textArea = this.commentWriterRef?.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
    textArea.style.zIndex = "-1";
  }

  onEnter(event: Event) {
    if (!this.shiftPressed) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      this.postComment();
    }
  }

  shiftPressed = false;
  onShift() {
    this.shiftPressed = true;
  }

  onUnShift() {
    this.shiftPressed = false;
  }
}
