import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripMapComponent } from './trip-map.component';

describe('TripMapComponent', () => {
  let component: TripMapComponent;
  let fixture: ComponentFixture<TripMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TripMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
