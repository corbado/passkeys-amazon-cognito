import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {Location} from '@angular/common'; 
import { Router } from '@angular/router';
import { AuthService } from '@corbado/auth/services/auth.service';
import { SpaceModel } from '@corbado/models/space.model';
import { SpaceService } from 'src/app/services/space.service';
import { SettingsUserService } from 'src/app/services/settings-user.service';

@Component({
  selector: 'ho-space-selector',
  templateUrl: './space-selector.component.html',
  styleUrls: ['./space-selector.component.scss'],
})
export class SpaceSelectorComponent {

  @Input() currentView: 'spaces' | 'settings' | 'team-spaces' = 'spaces';
  @Output() currentViewChange = new EventEmitter<'spaces' | 'settings' | 'team-spaces'>();

  @HostListener('document:mouseup', ['$event.target']) 
  onKeydownHandler(target: HTMLElement) {
    if (target.className !== 'ci-More_Horizontal') {
      this.spaceMenuUUID = '';
    }
  }

  currentUserID = -1;
  spaceMenuUUID = '';
  spaceIndex = 0;
  selectedSpaceUUID = '';
  spaces: SpaceModel[] = [];
  spacesSubscribed: SpaceModel[] = [];
  currentUser: any;

  constructor(
    private spaceService: SpaceService,
    private settingsUserService: SettingsUserService,
    public router: Router,
    public auth: AuthService,
    private location: Location,
  ) {
    this.spaceService.spaces$.subscribe(feeds => {
      this.spaces = feeds.filter(s => s.id_creator === this.currentUserID);
      this.spacesSubscribed = feeds.filter(s => s.id_creator !== this.currentUserID);
    });

    this.spaceService.currentSpaceUUID$.subscribe(uuid => this.selectedSpaceUUID = uuid);

    if (this.auth.isAuth()) {
      this.settingsUserService.getUser().subscribe((user) => {
        if (user && user.id) {
          this.currentUserID = user.id as number;
        }
      });
    }
    setTimeout(() => {
      if (this.auth.isAuth()) {
        this.settingsUserService.getUser().subscribe((user) => {
          this.currentUser = {
            name: user.fullname,
            email: user.email,
            picture: user.picture,
          };
        });
      }
    }, 400); 
  }

  createSpace() {
    if (this.currentView === 'settings') {
      this.currentView = 'spaces';
      this.currentViewChange.emit('spaces');
      this.location.replaceState('/spaces');
    }
    this.spaceService.createNewFeed();
  }

  openSpaceMenu($event: MouseEvent, uuid: string): void {
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    if (uuid !== this.spaceMenuUUID) {
      this.spaceMenuUUID = uuid;
    } else {
      this.spaceMenuUUID = '';
    }
  }

  spaceClicked(spaceUUID: string) {
    this.spaceService.changeFeed(spaceUUID);
    this.currentView = 'spaces';
    this.currentViewChange.emit('spaces');
    this.location.replaceState('/spaces');
  }

  deleteSpaceReq(spaceUUID: string, event: MouseEvent, feedType: 'own' | 'subscribed'): void {
    event.stopPropagation();
    this.spaceMenuUUID = '';
    let index = -1;
    let futureSpaceUUID = '';
    if (spaceUUID === this.selectedSpaceUUID) {
      const targetSpaces = feedType === 'own' ? this.spaces : this.spacesSubscribed;
      index = targetSpaces.findIndex(s => s.feedID === spaceUUID) + 1;
      if (index === targetSpaces.length) index = index - 2;
      if (index > -1) futureSpaceUUID = targetSpaces[index].feedID;
    }
    this.spaceService.deleteFeed(spaceUUID);
    this.spaceService.changeFeed(futureSpaceUUID);
  }

  duplicateSpaceReq(spaceID: string, event: MouseEvent): void {
    event.stopPropagation();
    this.spaceMenuUUID = '';
    const space = this.spaces.find(s => s.feedID === spaceID);
    if (space) this.spaceService.duplicateSpace(space);
  }

}
