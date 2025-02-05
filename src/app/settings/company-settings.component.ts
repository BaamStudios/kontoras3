import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { EditComponent } from '../core/edit/edit.component';
import { CompanySettings } from '../../shared/entities/company-settings';
import { remult, Repository } from 'remult';
import { AutofieldComponent } from '../core/autofield/autofield.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, AutofieldComponent, ButtonModule, RouterLink, TranslateModule],
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent extends EditComponent<CompanySettings> implements OnInit {
  override rootPath = '/settings/company-settings';
  override repo = remult.repo(CompanySettings);
  override returnWithEntityId = false;

  override async ngOnInit(): Promise<void> {
    this.id = "1";
    await super.ngOnInit();

  }
}
