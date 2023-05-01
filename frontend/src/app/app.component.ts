import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NgxHotjarService } from 'ngx-hotjar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  log!: Array<Array<any>>;

  constructor(
    public hjService: NgxHotjarService,
    private cdr: ChangeDetectorRef,
  ) {
    // hjService.hj();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  @HostListener('click')
  onClick() {
    try {
      this.log = (window as any).hj.q;
      this.cdr.detectChanges();
    } catch (err) {
      console.error(err);
    }
  }
}
