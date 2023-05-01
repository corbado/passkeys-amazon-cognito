import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewLayoutComponent } from './new-layout/new-layout.component';
import { AuthGuardService } from '@corbado/auth/services/guard/auth-guard.service';
import { NotFoundComponent } from '@corbado/pages/not-found/not-found.component';
import { SpacesComponent } from '@corbado/pages/spaces/spaces.component';
import { SettingsNewComponent } from '@corbado/pages/settings/settings-new.component';
import { RouteGuardService } from '../services/guards/route-guard.service';

const routes: Routes = [
  {
    // Single space for guest
    path:'space', component: NewLayoutComponent,
    children: [
      {path: ':uuid', component: SpacesComponent},
      {path: ':uuid/:email', component: SpacesComponent}
    ],
  },
  {
    // Full app for users
    path:'', component:NewLayoutComponent, canActivate: [AuthGuardService],
    children:[
      {path:'spaces',component:SpacesComponent,canActivate:[RouteGuardService]},
      {path:'spaces/settings',component:SpacesComponent,canActivate:[RouteGuardService]},
      {path:'spaces/settings/:setting',component:SpacesComponent,canActivate:[RouteGuardService]},
      {path:'spaces/team-spaces',component:SpacesComponent,canActivate:[RouteGuardService]},
      {path:'',redirectTo:'spaces', pathMatch:"full"},
      {path:'settings', component:SettingsNewComponent,canActivate:[RouteGuardService]},
      {path:'settings/:setting', component:SettingsNewComponent, canActivate:[RouteGuardService]}
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
