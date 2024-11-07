import { Component, Input, OnInit } from '@angular/core';
import { remult } from 'remult';
import { Company } from '../../../shared/entities/company';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { AddressViewComponent } from '../address-view/address-view.component';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule, JsonPipe, RouterLink, AddressViewComponent, TranslateModule], // Add TranslateModule to imports
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.scss'],
})
export class CompanyViewComponent implements OnInit {
  showConfirmDeleteModal = false;

  @Input() id!: string;
  repo = remult.repo(Company);
  entity?: Company;

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
