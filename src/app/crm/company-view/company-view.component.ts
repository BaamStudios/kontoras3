import { Component, Input, OnInit } from '@angular/core';
import { remult } from 'remult';
import { Company } from '../../../shared/entities/company';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { AddressViewComponent } from '../address-view/address-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { featureFlags } from '../../feature-flags';

@Component({
  selector: 'app-company-view',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    TableModule,
    RouterLink,
    AddressViewComponent,
    TranslateModule,
  ],
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.scss'],
})
export class CompanyViewComponent implements OnInit {
  showConfirmDeleteModal = false;

  @Input() id!: string;
  repo = remult.repo(Company);
  entity?: Company | null;
  featureFlags = featureFlags;

  constructor(private router: Router) {}

  async ngOnInit() {
    this.entity = await this.repo.findId(this.id);
  }

  confirmDelete() {
    this.showConfirmDeleteModal = true;
  }

  async delete() {
    this.showConfirmDeleteModal = false;
    await this.repo.delete(this.id);
    this.router.navigate(['/crm/company/overview']);
  }
}
