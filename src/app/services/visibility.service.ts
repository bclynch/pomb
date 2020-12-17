import { Inject, Injectable, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, combineLatest, concat, defer, of, fromEvent, Observer } from 'rxjs';
import { map, flatMap, distinctUntilChanged, tap} from 'rxjs/operators';

@Injectable()
export class VisibilityService {
  private pageVisible$: Observable<boolean>;

  constructor(@Inject(DOCUMENT) document: any) {
    this.pageVisible$ = concat(
      defer(() => of(!document.hidden)),
      fromEvent(document, 'visibilitychange')
        .pipe(
          map(e => !document.hidden)
        )
    );
  }

  elementInSight(element: ElementRef): Observable<boolean> {
    const el = element.nativeElement;

    const elementVisible$ = Observable.create(observer => {
      const intersectionObserver = new IntersectionObserver(entries => {
        observer.next(entries);
      });

      intersectionObserver.observe(el);

      return () => { intersectionObserver.disconnect(); };
      })
      .pipe (
        flatMap((entries: IntersectionObserverEntry[]) => entries),
        map((entry: any) => entry.isIntersecting),
        distinctUntilChanged()
      );

    const elementInSight$ = combineLatest(
        this.pageVisible$,
        elementVisible$,
        (pageVisible, elementVisible: boolean) => pageVisible && elementVisible
      ).pipe(distinctUntilChanged());

    return elementInSight$;
  }
}
