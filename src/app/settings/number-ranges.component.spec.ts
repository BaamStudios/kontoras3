import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberRangesComponent } from './number-ranges.component';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';

describe('NumberRangesComponent', () => {
  let component: NumberRangesComponent;
  let fixture: ComponentFixture<NumberRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberRangesComponent, CommonModule, PanelModule, DividerModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
