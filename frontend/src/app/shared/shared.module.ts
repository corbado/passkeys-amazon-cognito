import { SelectModule } from './components/select/select.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { ButtonModule } from './components/button/button.module';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogActionComponent } from './components/dialog/dialog-action/dialog-action.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditableFieldComponent } from './components/editable-field/editable-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';   
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IncrementalComponent } from './components/incremental/incremental.component';
import { StateCirclesComponent } from './components/state-circles/state-circles.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastComponent } from './components/toast/toast.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InvitationDialogComponent } from './components/dialog/invitation-dialog/invitation-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { SupportBarComponent } from './components/support-bar/support-bar.component';
import { TagSearchComponent } from './components/tag-search/tag-search.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { FileDisplayComponent } from './components/file-display/file-display.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgcCookieConsentService, NgcStatusChangeEvent } from "ngx-cookieconsent";

@NgModule({
  declarations: [
    CardComponent,
    DialogActionComponent,
    CarouselComponent,
    EditableFieldComponent,
    SearchComponent,
    IncrementalComponent,
    StateCirclesComponent,
    ToastComponent,
    InvitationDialogComponent,
    TagListComponent,
    SupportBarComponent,
    TagSearchComponent,
    AvatarComponent,
    FileDisplayComponent
  ],
  exports:[
    CardComponent,
    SelectModule,
    ButtonModule,
    DialogActionComponent,
    CarouselComponent,
    MatProgressSpinnerModule,
    EditableFieldComponent,
    SearchComponent,  
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    IncrementalComponent,
    StateCirclesComponent,
    MatDialogModule,
    MatDialogModule,
    MatFormFieldModule,        
    MatInputModule,    
    MatSnackBarModule,
    MatProgressBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    TagListComponent,
    MatTabsModule,
    SupportBarComponent,
    TagSearchComponent,
    AvatarComponent,
    FileDisplayComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,    
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    PdfViewerModule
  ],
  providers:[
    NgDialogAnimationService
  ]
})
export class SharedModule { }
