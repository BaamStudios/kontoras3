import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { remult } from 'remult';
import { Invoice } from '../../../shared/entities/invoice';
import { featureFlags } from '../../feature-flags';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-invoice-view',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    PdfViewerModule,
    ButtonModule,
    CardModule,
    DialogModule,
  ],
  templateUrl: './invoice-view.component.html',
  styleUrl: './invoice-view.component.scss',
})
export class InvoiceViewComponent {
  showConfirmDeleteModal = false;
  featureFlags = featureFlags;

  @Input() id!: string;
  repo = remult.repo(Invoice);
  entity?: Invoice | null;

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
    this.router.navigate(['/om/invoice']);
  }
}
