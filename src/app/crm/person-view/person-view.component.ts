import { Component, Input, OnInit } from '@angular/core';
import { remult } from 'remult';
import { Person } from '../../../shared/entities/person';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { AddressViewComponent } from '../address-view/address-view.component';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule

@Component({
  selector: 'app-person-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule, JsonPipe, RouterLink, AddressViewComponent, TranslateModule], // Add TranslateModule to imports
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss'],
})
export class PersonViewComponent implements OnInit {
  showConfirmDeleteModal = false;

  @Input() id!: string;
  repo = remult.repo(Person);
  entity?: Person;

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
