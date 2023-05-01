import { ReactiveFormsModule } from '@angular/forms';
import { SelectColorComponent } from './select-color/select-color.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { SelectBasicComponent } from './select-basic/select-basic.component';

@NgModule({
  declarations: [SelectColorComponent, SelectBasicComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSelectModule],
  exports: [SelectColorComponent, SelectBasicComponent],
})
export class SelectModule {}
