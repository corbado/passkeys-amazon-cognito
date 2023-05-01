import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { BasicButtonComponent } from './basic-button/basic-button.component';
import { ActionButtonComponent } from './action-button/action-button.component';
import { IconTextButtonComponent } from './icon-text-button/icon-text-button.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { RouterModule } from '@angular/router';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { StatusButtonComponent } from './status-button/status-button.component';



@NgModule({
  declarations: [ToggleSwitchComponent,
                BasicButtonComponent,
                ActionButtonComponent,
                IconTextButtonComponent,
                MenuButtonComponent,
                CheckboxComponent,
                StatusButtonComponent,                
                ],
  imports: [
    CommonModule,    
    RouterModule,
  ],
  exports:[ToggleSwitchComponent,
    BasicButtonComponent,
    ActionButtonComponent,
    IconTextButtonComponent,
    MenuButtonComponent,
    CheckboxComponent,
    StatusButtonComponent
  ]
})
export class ButtonModule { }
