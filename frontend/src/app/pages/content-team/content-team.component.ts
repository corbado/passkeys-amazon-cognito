import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ContentType, PostModel, PostReaction } from '@corbado/models/post.model';
import { SpaceService } from 'src/app/services/space.service';
import { AuthService } from '@corbado/auth/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupService } from 'src/app/services/popup.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CONSTANT } from '@corbado/shared/constants';
import { UserInfo } from '@corbado/models/user.model';

@Component({
  selector: 'ho-content-team',
  templateUrl: './content-team.component.html',
  styleUrls: ['./content-team.component.scss'],
})
export class ContentTeamComponent implements OnInit, OnChanges {

  @Input() userInfo: UserInfo | undefined;
  @Output() movePostReq = new EventEmitter<{direction: number, objectID: string, type: string}>()
  @Output() removeUserReq = new EventEmitter<string>()

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
  ) {}

  ngOnInit(): void {
    const link = this.userInfo?.video_link;
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (link && link.match(p)) {
      // YouTube
      this.contentType = 'youtube';
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link.replace("watch?v=", "embed/"));
    } else if (link && link.match('loom.com')) {
      // Loom
      this.contentType = 'loom';
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link.replace("/share/", "/embed/"));
    }  else if (link && link.match('vidyard.com')) {
      // Others
      this.contentType = 'vidyard';
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    } else if (link && link.match('pitch.com')) {
      this.contentType = 'pitch';
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
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

  toggleCommentSection(): void {
    if (!this.commentsDisplayed) {
      this.commentsDisplayed = true;
      // TODO find way to compute height in advance
      this.commentsStyle = {height: "fit-content", transition: `height ${this.transitionTime}`, padding: '8px'};
    } else {
      this.commentsDisplayed = false;
      this.commentsStyle = {height: "0px", transition: `height ${this.transitionTime}`, padding: '0px'};
    }
  }

  onMailClicked(mail?: string) {
    if (mail) window.open(`mailto:${mail}`, "_blank");
  }

  onLinkClicked(link?: string): void {
    if (link) window.open(link, "_blank");
  }

  getContentHTML(stringContent: string) {
    let content = stringContent.replace(/(?:\r\n|\r|\n)/g, '<br>');
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	  content = content.replace(exp, "<a href='$1'>$1</a>");
	  var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    content = content.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
    return content;
  }

  removeUser(uuid?: string): void {
    if (uuid) {
      this.removeUserReq.emit(uuid);
    }
  }

  /* openContent(): void {
    if (this.post.links && this.post.links[0]) {
      this.onLinkClicked(this.post.links[0]);
      window.open(this.post.links[0], "_blank");
    } else if (this.post.files && this.post.files[0] && this.post.files[0].url) {
      if (this.post.files[0].name.endsWith('pdf') || this.post.files[0].name.endsWith('PDF')) {
        window.open(this.post.files[0].url.slice(0, -8) + 'pdf', "_blank");
      }
    }
  } */

  pinPostReq(id: any): void {
    this.feedService.pinPost(id);
  }

  movePost(direction: number): void {
    if (this.userInfo?.userID) this.movePostReq.emit({direction: direction, objectID: this.userInfo.userID, type: 'user'});
  }

  editCommentReq(id: any) {}
}
