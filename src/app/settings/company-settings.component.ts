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
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, AutofieldComponent, ButtonModule, TranslateModule, FileUploadModule],
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent extends EditComponent<CompanySettings> implements OnInit {
  override rootPath = '/settings/company-settings';
  override repo = remult.repo(CompanySettings);
  override returnWithEntityId = false;
  // Neue Eigenschaften für FileUpload und Vorschau
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  override async ngOnInit(): Promise<void> {
    this.id = "1";
    await super.ngOnInit();
    // Setze previewUrl, falls companyLogo vorhanden ist
    if (this.entity?.companyLogo) {
      this.previewUrl = this.entity.companyLogo;
    }
  }

  onFileSelect(event: any): void {
    // Speichere die ausgewählte Datei
    this.selectedFile = event.files[0];
    // Erstelle eine Vorschau
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile!);
  }

  override async saveChanges(): Promise<void> {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Weist den Base64-String dem Firmenlogo zu und speichert die Entität
        this.entity!.companyLogo = reader.result as string;
        await super.saveChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      await super.saveChanges();
    }
  }
}
