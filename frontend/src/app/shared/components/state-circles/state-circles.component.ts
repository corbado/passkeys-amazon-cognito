import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { State } from '@corbado/models/state.model';

@Component({
  selector: 'ho-state-circles',
  templateUrl: './state-circles.component.html',
  styleUrls: ['./state-circles.component.scss']
})
export class StateCirclesComponent implements OnInit {

  @Input() states: State[] = [];
  @Input() state!: State;
  @Input() enabled: boolean = true;

  @Output() changeState = new EventEmitter<State>();

  public indexStateTemp: number = -1;
  public indexState: number = -1;

  private timeOuts: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changeAnimation();
  }

  changeAnimation() {
    if (!this.state) {
      this.indexStateTemp = -1;
      this.indexState = -1;
    } else {
      this.indexState = this.states.map((item: State) => item.id).indexOf(this.state.id);
      for (let i = 0; i <= this.indexState; i++) {
        this.timeOuts.push(setTimeout(() => { this.indexStateTemp = i }, 300 * (i + 1)));
      }
    }
  }

  onChangeState(state: State, index: number): void {
    if (this.enabled && this.state.id != state.id) {
      this.timeOuts.forEach(time => clearTimeout(time));
      this.timeOuts = [];
      this.indexState = - 1;
      this.indexStateTemp = - 1;
      this.state = state;
      this.changeAnimation();
      this.changeState.emit(state);
    }
  }
}
