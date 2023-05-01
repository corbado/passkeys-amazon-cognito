import { Component, OnInit } from '@angular/core';
import { AuthService } from '@corbado/auth/services/auth.service';
import { SpaceModel } from '@corbado/models/space.model';
import { CompanyService } from 'src/app/services/company.service';
import { SpaceService } from 'src/app/services/space.service';

@Component({
  selector: 'ho-team-spaces',
  templateUrl: './team-spaces.component.html',
  styleUrls: ['./team-spaces.component.scss'],
})
export class TeamSpacesComponent implements OnInit {

  teamSpaces: SpaceModel[] = [];
  dropDownOpen = false;
  dropDownStyle = {
    "height.Px": 24
  };

  constructor(
    private spaceService: SpaceService,
    private companyService: CompanyService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const userID = parseInt(this.auth.getUserID() + '');
    this.companyService.getCompanySpaces().subscribe(answer => {
      this.teamSpaces = answer.filter(s => s.id_creator != userID)
    });
  }

  toggleDropDown() {
    console.log('toggle');
    if (this.dropDownOpen) {
      this.dropDownStyle['height.Px'] = 24;
      this.dropDownOpen = false;
    } else {
      this.dropDownStyle['height.Px'] = 50;
      this.dropDownOpen = true;
    }
  }

  onDuplicateClick(space: SpaceModel) {
    this.spaceService.duplicateSpace(space);
  }

  onAddToMySpacesClick(spaceID: string) {
    this.spaceService.getSpaces(spaceID);
  }

}
