import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClarityModule, ClrCheckboxModule, ClrComboboxModule, ClrFormsModule, ClrTabsModule } from '@clr/angular';
import { remult } from 'remult';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { Contest } from '../../../shared/entities/contest';
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { EditComponent } from '../../core/edit/edit.component';

@Component({
  selector: 'app-contest-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClrFormsModule,
    ClarityModule,
    ClrCheckboxModule,
    ClrComboboxModule,
    AutofieldComponent,
    ClrTabsModule,
    JsonPipe,
    RouterLink,
    TranslateModule // Add TranslateModule to imports
  ],
  templateUrl: './contest-edit.component.html',
  styleUrl: './contest-edit.component.scss'
})
export class ContestEditComponent extends EditComponent<Contest> {
  repo = remult.repo(Contest);
  override rootPath = '/schuetze/overview';
  override returnWithEntityId = false;
  previewInvoiceNumber: string = '';

  constructor(router: Router) {
    super(router);
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }
}
