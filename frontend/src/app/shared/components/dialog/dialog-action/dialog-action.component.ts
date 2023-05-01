import { ComponentFactory, ComponentFactoryResolver, ComponentRef, Inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ho-dialog',
  templateUrl: './dialog-action.component.html',
  styleUrls: ['./dialog-action.component.scss']
})
export class DialogActionComponent implements OnInit, OnDestroy {

  @ViewChild('target', {read: ViewContainerRef,static: true}) vcRef!: ViewContainerRef;
  componentRef!: ComponentRef<any>;

  constructor(
    public dialogRef: MatDialogRef<DialogActionComponent>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
    const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.data.component);
    this.componentRef = this.vcRef.createComponent(factory);
    const hostedComponent = this.componentRef.instance;
    

    // pass Inputs to component
    if (this.data.inputs) {
      Object.keys(this.data.inputs).forEach(inputName => {
        hostedComponent[inputName] = this.data.inputs[inputName]
      })
    }
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}
