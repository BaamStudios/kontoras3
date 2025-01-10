import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestRunComponent } from './contest-run.component';

describe('ContestRunComponent', () => {
  let component: ContestRunComponent;
  let fixture: ComponentFixture<ContestRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContestRunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContestRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
