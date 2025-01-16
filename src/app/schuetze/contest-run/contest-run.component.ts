import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ClarityModule,
  ClrCheckboxModule,
  ClrComboboxModule,
  ClrDatepickerModule,
  ClrFormsModule,
  ClrRadioModule,
  ClrTabsModule,
  ClrModalModule, // Import ClrModalModule
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { remult } from 'remult';
import { Contest } from '../../../shared/entities/contest';
import { AutofieldComponent } from '../../core/autofield/autofield.component';
import { idType } from 'remult/src/remult3/remult3';
import { Person } from '../../../shared/entities/person';
import { Shooting } from '../../../shared/entities/shooting';
//import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-contest-run',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClrFormsModule,
    ClarityModule,
    ClrCheckboxModule,
    ClrComboboxModule,
    ClrRadioModule,
    AutofieldComponent,
    ClrTabsModule,
    JsonPipe,
    RouterLink,
    TranslateModule, // Add TranslateModule to imports
    ClrDatepickerModule,
    ClrModalModule, // Add ClrModalModule to imports,
    //BaseChartDirective
  ],
  templateUrl: './contest-run.component.html',
  styleUrl: './contest-run.component.scss',
})
export class ContestRunComponent implements OnInit {

  repoContest = remult.repo(Contest);
  repoPerson = remult.repo(Person);
  repoShooting = remult.repo(Shooting);

  @Input() id!: idType<Contest>;
  fields: any;
  contest?: Contest;
  selectedShooter?: Person;

  async selectedShooterChanged(shooter: Person) {
    this.selectedShooter = shooter;
    this.reloadResults();
   }
  shooters?: Person[];
  shooterResults: any[] = [];

  selectedShooting?: Shooting = undefined;

  deleteModalOpen = false;
  deleteCandidate!: Shooting;

  constructor(private router: Router) {}

  async ngOnInit() {
    this.fields = this.repoContest.metadata.fields;
    if (this.id) {
      this.contest = await this.repoContest.findId(this.id);
      this.shooters = await this.repoPerson.find();
      console.log('Shooters:', this.shooters);
    }
    // Log the entity to the console
    console.log('Contest:', this.contest);
  }

  createShooting() {
    console.log('Create shooting for', this.selectedShooter);

    this.selectedShooting = this.repoShooting.create({
      shooterId: this.selectedShooter!.id,
      contestId: this.contest!.id,
      shootingDate: new Date(), // Set default date to today
      anschlag: 'stehend',
      support: true,
    });

    console.log('New shooting:', this.selectedShooting);
  }

  cancelShooting() {
    this.selectedShooting = undefined;
  }

  async saveShooting() {
    await this.repoShooting.save(this.selectedShooting!);
    this.selectedShooting = undefined;
    await this.reloadResults();
  }

  async reloadResults(shooter: Person | undefined = this.selectedShooter) {

    if (shooter && this.contest) {
      this.shooterResults = [];
      this.shooterResults = await this.repoShooting.find({
        where: {
          contestId: this.contest.id,
          shooterId: shooter.id,
        }, orderBy: { shootingDate: 'asc' }
      });
    }
  }

  editShooting(result: Shooting): void {
    this.selectedShooting = result;
  }

  confirmDelete(result: Shooting) {
    this.deleteCandidate = result;
    this.deleteModalOpen = true;
  }

  async deleteShooting(result: Shooting) {
    await this.repoShooting.delete(result);
    this.deleteModalOpen = false;
    await this.reloadResults();
  }
}
