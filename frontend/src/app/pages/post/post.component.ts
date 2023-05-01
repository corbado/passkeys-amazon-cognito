import { Component, ElementRef, Input, Output, EventEmitter, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostModel, PostReaction } from '@corbado/models/post.model';
import { SpaceService } from 'src/app/services/space.service';
import { AuthService } from '@corbado/auth/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'ho-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnChanges, OnDestroy {

  @Input() post: PostModel = {
    id: 0,
    id_creator: 0,
    index: 0,
    content: '',
    link_open_count: 0,
    comments: [],
    author: undefined,
  };
  @Input() enableAnalytics = false;
  @Input() canPost = true;
  @Input() guest = false;
  @Input() guestReactions: {postID: string, like: boolean, celebrate: boolean}[] = [];

  @ViewChild('commentWriterRef') commentWriterRef: ElementRef | undefined;
  // commentText: string = '';

  constructor(
    public dialog: MatDialog,
    public utils: UtilsService,
    public auth: AuthService,
    private feedService: SpaceService,
    private popupService: PopupService,
    private notificationService: NotificationService,
  ) {
  }

  postEditIndex = -1;

  numberOfViews = 0;
  hasAnalytics = false;

  ngOnInit(): void {
    if (this.post.comments) {
      this.post.comments.sort((c1, c2) => this.utils.compareByTimeStamp(c2, c1));
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

  openPostEditMenu(index: any): void {
    if (this.postEditIndex === index) this.postEditIndex = -1;
    else this.postEditIndex = index;
  }

  postComment(): void {
    if (this.canPost && this.commentWriterRef?.nativeElement.value) {
      const newComment: PostModel = {
        id_creator: -1,
        index: 0, //TODO
        link_open_count: 0,
        content: this.commentWriterRef?.nativeElement.value,
      }
      if (this.auth.isAuth() && this.post.postID) {
        newComment.author = this.auth.getUserAsAuthor();
        newComment.id_creator = parseInt(this.auth.getUserID() + '');
        this.post.comments?.push(newComment);
        this.feedService.addComment(newComment, this.post.postID);
      } else {
        this.feedService.addCommentAsGuest(newComment, this.post.postID ? this.post.postID : '');
      }
    }
  }

  onLinkClicked(link: string): void {
    this.feedService.updateLinkOpenCount({postID: parseInt(this.post.id + ''), link}).subscribe((_res) => console.log('opening link'));
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
    let reactions: {like: number[], celebrate: number[]} = {like: [], celebrate: []};
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
          const newReac = {postID: this.post.postID ? this.post.postID : '', like: false, celebrate: false};
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
    if (id ) {
      // this.feedService.deletePost(id);
    }
  }

  editPostReq(): void {
    this.popupService.openPopup('edit-post', this.post);
  }

  pinPostReq(id: any): void {
    this.feedService.pinPost(id);
  }

  movePost(direction: number): void {
  }

  deleteCommentReq(id: any) {
    if (id && this.post.comments) {
      const commentIndex = this.post.comments?.findIndex(c => c.id == id);
      const commment = this.post.comments.splice(commentIndex, 1);
      this.feedService.deleteComment(id).subscribe(res => {
        this.notificationService.showNotification("Comment removed successfully.", "success", 1000);
      });
    }
  }

  editCommentReq(id: any) {}

  autogrow(){
    const textArea = this.commentWriterRef?.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight - 20 + 'px';
    textArea.style.zIndex = "-1";
  }

  ngOnDestroy(): void {
  }
}
