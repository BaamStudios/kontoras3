import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { remult } from 'remult';
import { Invoice } from '../../shared/entities/invoice';
import { featureFlags } from '../feature-flags';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-om',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    RouterLink,
    TranslateModule,
    CardModule
  ],
  templateUrl: './om.component.html',
  styleUrl: './om.component.scss',
})
export class OmComponent implements OnInit {
  invoiceRepo = remult.repo(Invoice);
  invoices: Invoice[] = [];
  featureFlags = featureFlags.omOverview;

  sortOrder: number = -1; // PrimeNG uses number for sort order
  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {} // Initialize the 'router', 'translate', and 'toastr' variables

  async ngOnInit() {
    const invoices = this.featureFlags.includeInvoices
      ? await this.invoiceRepo.find()
      : [];
    this.invoices = [...invoices];
  }

  copyInvoiceId(id: string) {
    navigator.clipboard.writeText(id);
    this.toastr.success(this.translate.instant('clipboardSuccess'));
  }

  openInvoice(entity: Invoice) {
    this.router.navigateByUrl('/om/invoice/' + entity.id); // Use 'this.router' to navigate
  }
}
