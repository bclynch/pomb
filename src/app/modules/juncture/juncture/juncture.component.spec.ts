import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JunctureComponent } from './juncture.component';

describe('JunctureComponent', () => {
  let component: JunctureComponent;
  let fixture: ComponentFixture<JunctureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JunctureComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JunctureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
