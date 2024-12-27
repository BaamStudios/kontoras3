import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchuetzeComponent } from './schuetze.component';

describe('SchuetzeComponent', () => {
  let component: SchuetzeComponent;
  let fixture: ComponentFixture<SchuetzeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchuetzeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchuetzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
