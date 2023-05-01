import { Injectable } from '@angular/core';
import { AuthService } from '@corbado/auth/services/auth.service';
import { CompanyModel } from '@corbado/models/company.model';
import { MenuItem } from '@corbado/models/menu-item.model';
import { CompanyAccessList, CompanyService } from './company.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuItemsSeller: MenuItem[] = [
    {
      id: 0,
      name: "Deine Feeds",
      icon: "ci-home_heart",
      path: "/feeds"
    },
    {
      id: 1,
      name: "Übersicht",
      icon: "ci-dashboard",
      path: "/hub"
    },
    {
      id: 2,
      name: "Sales Anfragen",
      icon: "ci-notification_outline",
      path: "/inquiries-sell"
    },
    {
      id: 3,
      name: "Dein Portfolio",
      icon: "ci-color",
      path: "/my-portfolio"
    },
    {
      id: 4,
      name: "Deine Produkte",
      icon: "ci-file_new",
      path: "/my-products"
    },
    {
      id: 5,
      name: "Deine Kunden",
      icon: "ci-User_01_check",
      path: "/portfolio-access"
    }
  ];
  menuItemsBuyer: MenuItem[] = [
    {
      id: 0,
      name: "Deine Feeds",
      icon: "ci-home_heart",
      path: "/feeds"
    },
    {
      id: 1,
      name: "Dein Dashboard",
      icon: "ci-home_heart",
      path: "/dashboard"
    },
    {
      id: 2,
      name: "Deine Anfragen",
      icon: "ci-Mail_open",
      path: "/inquiries-buy"
    },

  ];


  currentMenuItems: MenuItem[] = []


  constructor(private utils: UtilsService, private auth: AuthService, companyService: CompanyService) {
    companyService.getAccessCompaniesBuySide(auth.getCompany().id).subscribe(
      (res: CompanyAccessList[]) => {
        res = res.filter((company: CompanyAccessList) => { return company.accepted });
        res.forEach((item: CompanyAccessList, index) => {
          this.menuItemsBuyer.push(
            {
              id: index + 3,
              name: `${item.company.name} Portfolio`,
              icon: this.utils.ensure(item.company.logo).url,
              path: "/portfolio/" + item.company.id
            }
          );
        });
        this.menuItemsBuyer.push(
          {
            id: this.menuItemsBuyer.length,
            name: 'Alle Dienstleister',
            icon: 'ci-color',
            path: '/add-company'
          }
        )
      }
    );

  }

  getCurrentMenuItem(isSeller: boolean): MenuItem[] {
    if (isSeller) {
      this.currentMenuItems = this.menuItemsSeller;
    } else {
      this.currentMenuItems = this.menuItemsBuyer;
    }
    return this.currentMenuItems;
  }




}
