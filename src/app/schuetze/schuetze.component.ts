import { CommonModule } from '@angular/common';
// ...existing code...
import { featureFlags } from '../feature-flags';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClarityModule, ClrComboboxModule, ClrDatagridModule, ClrDropdownModule, ClrDatagridSortOrder } from '@clr/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { remult } from 'remult';
import { Company } from '../../shared/entities/company';
import { Customer } from '../../shared/entities/customer';
import { Person } from '../../shared/entities/person';
import { Contest } from '../../shared/entities/contest';

@Component({
  selector: 'app-schuetze',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule, ClrComboboxModule, ClrDatagridModule, RouterLink, ClrDropdownModule, TranslateModule],
  templateUrl: './schuetze.component.html',
  styleUrl: './schuetze.component.scss',
})
export class SchuetzeComponent implements OnInit {
deleteContest(_t92: Contest) {
throw new Error('Method not implemented.');
}
  contestRepo = remult.repo(Contest);
  contests: Contest[] = [];
  featureFlags = featureFlags.schuetzeOverview;

  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.DESC;
  constructor(private router: Router, private translate: TranslateService, private toastr: ToastrService) {} // Initialize the 'router', 'translate', and 'toastr' variables

  async ngOnInit() {
    const contests = await this.contestRepo.find();
    this.contests = contests;
  }

  copyContestId(id: string) {
    navigator.clipboard.writeText(id);
    this.toastr.success(this.translate.instant('clipboardSuccess'));
  }

  runContest(entity: Contest) {
    this.router.navigateByUrl('/schuetze/contest/' + entity.id + '/run'); // Use 'this.router' to navigate
  }
}
