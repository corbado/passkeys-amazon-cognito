import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NewLayoutComponent } from './new-layout/new-layout.component';
import { TopMenuBarComponent } from './top-menu-bar/top-menu-bar.component';
import { SharedModule } from '@corbado/shared/shared.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
    NewLayoutComponent,
    TopMenuBarComponent
  ],
  exports:[
    MainLayoutComponent,
    NewLayoutComponent,
    TopMenuBarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ]
})
export class CoreModule { }
