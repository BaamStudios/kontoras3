import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ClarityModule,
  ClrCheckboxModule,
  ClrComboboxModule,
  ClrDatepickerModule,
  ClrFormsModule,
  ClrModalModule,
  ClrRadioModule,
  ClrTabsModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core'; // Import TranslateModule
import { remult } from 'remult';
import { idType } from 'remult/src/remult3/remult3';
import { Contest } from '../../../shared/entities/contest';
import { Person } from '../../../shared/entities/person';
import { Shooting } from '../../../shared/entities/shooting';
//import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-contest-run',
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    ClrFormsModule,
    ClarityModule,
    ClrCheckboxModule,
    ClrComboboxModule,
    ClrRadioModule,
    ClrTabsModule,
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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'line'> | undefined;

  public barChartOptions: ChartConfiguration<'line'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'line'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    ],
  };

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
        },
        orderBy: { shootingDate: 'asc' },
      });

      this.updateChartData();

    }
  }
  updateChartData() {
    this.barChartData = {
      labels: this.shooterResults.map((r) => r.shootingDate?.toLocaleDateString()),
      datasets: [
        { data: this.shooterResults.map((r) => r.points), label: 'Punkte' },
        { data: this.shooterResults.map((r) => r.rings), label: 'Ringe' },
      ],
    };
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
