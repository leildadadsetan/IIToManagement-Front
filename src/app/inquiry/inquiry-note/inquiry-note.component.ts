import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { InquiryNote } from '@core/domain-classes/inquiry-note';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { InquiryNoteService } from './inquiry-note.service';

@Component({
  selector: 'app-inquiry-note',
  templateUrl: './inquiry-note.component.html',
  styleUrls: ['./inquiry-note.component.scss']
})
export class InquiryNoteComponent extends BaseComponent implements OnInit {

  @Input() inquiryId: string;
  commentForm: UntypedFormGroup;
  inquiryNotes: InquiryNote[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private inquiryNoteService: InquiryNoteService,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService) {
    super(translationService);
   
  }

  ngOnInit(): void {
    this.createForm();
    this.getNotes();
  }

  createForm() {
    this.commentForm = this.fb.group({
      note: ['', [Validators.required]]
    });
  }
  getNotes() {
    this.sub$.sink = this.inquiryNoteService.getInquiryNotes(this.inquiryId)
      .subscribe((c: InquiryNote[]) => {
        this.inquiryNotes = c;
      })
  }
  patchNote(note: string) {
    this.commentForm.patchValue({
      note: note
    });
  }
  addComment() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }
    const inquiryNote: InquiryNote = {
      inquiryId: this.inquiryId,
      note: this.commentForm.get('note').value
    };
    this.sub$.sink = this.inquiryNoteService.saveInquiryNote(inquiryNote)
      .subscribe((c: InquiryNote) => {
        this.patchNote('');
        this.commentForm.markAsUntouched();
        this.getNotes();
      });
  }
  onDelete(id: string) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.inquiryNoteService.deleteInquiryNote(id)
            .subscribe(() => {
              this.getNotes();
            });
        }
      });
  }

}
