import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from '@corbado/models/user.model';
import { Author, SpaceModel } from '@corbado/models/space.model';
import { emojis3 } from './emojis.model';
import { AuthUser } from '@corbado/auth/auth-user';
import { PublicFile } from '@corbado/models/public-file.model';

@Component({
  selector: 'ho-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() avatarData: Author | AuthUser | UserModel | SpaceModel | undefined;

  @Input() avatarText: string | undefined = '';
  displayText: string = '';

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private router: Router,
  ) {
  }

  imgBase64 = '';
  ngOnInit(): void {
    this.setAvatar();
  }

  picURL: any;
  lazyLoad = false;
  setAvatar(): void { // TODOOOOOOOO
    if (this.avatarData) {
      if ((this.avatarData as AuthUser).picture) {
        const user = (this.avatarData as AuthUser);
        if (user.picture) {
          const pic: PublicFile = user.picture;
          this.lazyLoad = true;
          this.picURL = pic.url;
        }
      }  else if ((this.avatarData as Author).picture) {
        const user = (this.avatarData as Author);
        if (user.picture) {
          const pic: PublicFile = user.picture;
          this.lazyLoad = true;
          this.picURL = pic.url;
        }
      } else {
        // Test if its a user
        if ((this.avatarData as UserModel).email) {
          const user = this.avatarData as UserModel;
          if (user.fullname) {
            this.displayText = user.fullname.split(' ')[0][0] + user.fullname.split(' ')[1][0];
          } else {
            this.setDisplayTextForEmail(user.email);
          }
        }
        // test if its a feed
        if ((this.avatarData as SpaceModel).title) {
          const feed = this.avatarData as SpaceModel;
          this.displayText = '&#' + emojis3[(this.avatarData as SpaceModel).id % emojis3.length];
        }
        if ((this.avatarData as Author).name) {
          const author = this.avatarData as Author;
          this.displayText = author.name.split(' ').map(e => e[0]).join('').toUpperCase();
        }
      }
    } else {
      if (this.avatarText) {
        if (this.avatarText.split(' ').length > 1) {
          this.displayText = this.avatarText.split(' ').map(e => e[0]).join('').toUpperCase();
        } else {
          this.setDisplayTextForEmail((this.avatarText ? this.avatarText : ''));
        }
      }
    }
  }

  setDisplayTextForEmail(email: string): void {
    const splitByDot = email.split('@')[0].split('.');
      if (splitByDot.length === 1) {
        this.displayText = email.split('@').map(e => e[0]).join('').toUpperCase();
      } else {
        this.displayText = splitByDot.filter((v, i) => i < 3).map(e => e[0]).join('').toUpperCase();
      }
  }

  redirect(): void {
    if (this.auth.getUserID() && this.avatarData && this.avatarData.id === this.auth.getUserID()) {
      this.router.navigate(['spaces/settings']);
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.setAvatar();
    if (!this.displayText && this.avatarText) {
      this.displayText = this.avatarText.split(' ').filter((v, i) => i < 3).map(e => e[0]).join('').toUpperCase();
    }
  }

  ngOnDestroy(): void {
  }
}
