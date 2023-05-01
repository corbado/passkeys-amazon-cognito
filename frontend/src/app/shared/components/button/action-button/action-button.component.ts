import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

export interface ActionButtonProperties {
  buttons: { icon: string, text: string }[];
  disabled: boolean;
}

@Component({
  selector: 'ho-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements AfterViewInit, ActionButtonProperties {

  @Input() disabled !: boolean;
  @Input() size!: { width: string; height: string };
  @Input() buttons!: { icon: string, text: string, if?: boolean }[];
  @Output() clickEvent = new EventEmitter<number>();

  constructor(private cdr: ChangeDetectorRef) { }

  emitButtonId(id: number) {
    this.clickEvent.emit(id);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
