import { Component } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from '@corbado/auth/services/auth.service';
import { SpaceService } from 'src/app/services/space.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ho-new-layout',
  templateUrl: './new-layout.component.html',
  styleUrls: ['./new-layout.component.scss'],
})
export class NewLayoutComponent {

  constructor(public utils: UtilsService, public auth: AuthService, public feedService: SpaceService, public router: Router) { }
}
