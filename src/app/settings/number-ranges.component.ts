import { Component } from '@angular/core';
import { NumberRangeEditComponent } from './number-range-edit/number-range-edit.component';
import { ClarityModule } from '@clr/angular';
import { numberRangeTypes } from '../../shared/entities/number-range';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-number-ranges',
    imports: [NumberRangeEditComponent, ClarityModule, CommonModule],
    templateUrl: './number-ranges.component.html',
    styleUrl: './number-ranges.component.scss'
})
export class NumberRangesComponent {
  numberRangeTypes = numberRangeTypes;
}
