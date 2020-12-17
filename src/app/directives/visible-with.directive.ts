import { Directive, TemplateRef, ViewContainerRef, Input, ElementRef } from '@angular/core';
import { VisibilityService } from '../services/visibility.service';
import {take, filter } from 'rxjs/operators';

@Directive({ selector: '[visibleWith]'})
export class VisibleWith {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private visibilityService: VisibilityService) { }

  @Input()
  set visibleWith(element) {
    this.visibilityService
        .elementInSight(new ElementRef(element))
        .pipe(filter(visible => visible), take(1))
        .subscribe(() => {
          this.viewContainer.createEmbeddedView(this.templateRef);
        });
  }
}
