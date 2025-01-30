import { Component, Input, OnInit } from '@angular/core';
import { remult } from 'remult';
import { Person } from '../../../shared/entities/person';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AddressViewComponent } from '../address-view/address-view.component';
import { featureFlags } from '../../feature-flags';

@Component({
  selector: 'app-person-view',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    ButtonModule,
    TableModule,
    DialogModule,
    AddressViewComponent,
  ],
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss'],
})
export class PersonViewComponent implements OnInit {
  showConfirmDeleteModal = false;
  featureFlags = featureFlags;

  @Input() id!: string;
  repo = remult.repo(Person);
  entity?: Person | null;

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
    this.router.navigate(['/crm/person/overview']);
  }
}
