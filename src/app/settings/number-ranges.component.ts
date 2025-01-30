import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { numberRangeTypes } from '../../shared/entities/number-range';
import { NumberRangeEditComponent } from './number-range-edit/number-range-edit.component';

@Component({
    selector: 'app-number-ranges',
    imports: [NumberRangeEditComponent, CommonModule, DividerModule],
    templateUrl: './number-ranges.component.html',
    styleUrl: './number-ranges.component.scss'
})
export class NumberRangesComponent {
  numberRangeTypes = numberRangeTypes;
}
