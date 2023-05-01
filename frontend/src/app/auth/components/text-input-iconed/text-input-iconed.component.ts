import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ho-text-input-iconed',
  templateUrl: './text-input-iconed.component.html',
  styleUrls: ['./text-input-iconed.component.scss'],
})
export class TextInputIconedComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() icon: string = 'error';
  @Input() type: string = 'text';
  @Input() formGrp: FormGroup|null = null;
  @Input() showInputStatus: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public isValid(): boolean{
    return (this.showInputStatus && !this.formGrp?.invalid && this.formGrp?.get('input')?.touched)?? false;
  }

  public isInvalid(): boolean{
    return (this.showInputStatus && this.formGrp?.invalid && this.formGrp?.get('input')?.touched)?? false;
  }
}
