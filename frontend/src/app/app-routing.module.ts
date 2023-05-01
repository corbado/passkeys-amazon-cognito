import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { CoreRoutingModule } from './core/core.routing';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    CoreRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
