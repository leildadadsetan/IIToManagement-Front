import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailTemplate } from '@core/domain-classes/email-template';
import { TranslationService } from '@core/services/translation.service';
import { EditorConfig } from '@shared/editor.config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { EmailTemplateService } from '../email-template.service';

@Component({
  selector: 'app-email-template-manage',
  templateUrl: './email-template-manage.component.html',
  styleUrls: ['./email-template-manage.component.scss']
})
export class EmailTemplateManageComponent extends BaseComponent implements OnInit {

  emailTemplateForm: UntypedFormGroup;
  emailTemplate: EmailTemplate;
  editorConfig = EditorConfig;

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private emailTemplateService: EmailTemplateService,
    private router: Router,
    private toastrService: ToastrService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
    this.createEmailTemplateForm();
    this.getEmailResolverData();
  }

  getEmailResolverData() {
    this.sub$.sink = this.route.data.subscribe(
      (data: { emailTemplate: EmailTemplate }) => {
        if (data.emailTemplate) {
          this.emailTemplate = data.emailTemplate;
          this.patchEmailTemplateData();
        }
      });
  }

  addUpdateEmailTemplate() {
    if (this.emailTemplateForm.valid) {
      if (this.emailTemplate) {
        this.sub$.sink = this.emailTemplateService
          .updateEmailTemplate(this.createBuildObject())
          .subscribe(c => {
            this.toastrService.success(this.translationService.getValue('EMAIL_TEMPLATE_UPDATED_SUCCESSFULLY'));
            this.router.navigate(['/emailtemplate']);
          });
      } else {
        this.sub$.sink = this.emailTemplateService
          .addEmailTemplate(this.createBuildObject())
          .subscribe(c => {
            this.toastrService.success(this.translationService.getValue('EMAIL_TEMPLATE_SAVE_SUCCESSFULLY'))
            this.router.navigate(['/emailtemplate']);
          })
      }
    } else {
      for (let inner in this.emailTemplateForm.controls) {
        this.emailTemplateForm.get(inner).markAsDirty();
        this.emailTemplateForm.get(inner).updateValueAndValidity();
      }
    }
  }

  createBuildObject(): EmailTemplate {
    const emailTemplate: EmailTemplate = {
      id: this.emailTemplate ? this.emailTemplate.id : null,
      name: this.emailTemplateForm.get('name').value,
      subject: this.emailTemplateForm.get('subject').value,
      body: this.emailTemplateForm.get('body').value
    }
    return emailTemplate;
  }

  createEmailTemplateForm() {
    this.emailTemplateForm = this.fb.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]]
    })
  }

  patchEmailTemplateData() {
    this.emailTemplateForm.patchValue({
      name: this.emailTemplate.name,
      subject: this.emailTemplate.subject,
      body: this.emailTemplate.body
    })
  }

}
