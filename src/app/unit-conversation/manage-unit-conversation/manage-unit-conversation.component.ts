import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnitOperator } from '@core/domain-classes/operator';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { UnitConversationService } from '../unit-conversation.service';

@Component({
  selector: 'app-manage-unit-conversation',
  templateUrl: './manage-unit-conversation.component.html',
  styleUrls: ['./manage-unit-conversation.component.scss']
})
export class ManageUnitConversationComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  unitOperatorslist: UnitOperator[] = [];
  baseUnits: UnitConversation[] = [];
  unitConversationForm: UntypedFormGroup;
  isOperator: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ManageUnitConversationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { unitdata: UnitConversation, units: UnitConversation[] },
    private unitConversationService: UnitConversationService,
    private fb: UntypedFormBuilder,
    public translationService: TranslationService,
    private toastrService: ToastrService) {
    super(translationService);
    this.getLangDir();
    this.baseUnits = this.data.units.filter(c => !c.parentId);
  }

  ngOnInit(): void {
    this.createForm();
    this.unitConversationsList();
    if (this.data.unitdata.id) {
      this.unitConversationForm.patchValue(this.data.unitdata);
       this.baseUnits=this.data.units.filter(c => c.id != this.data.unitdata.id && !c.parentId)
      this.isEdit = true;
    }
  }

  createForm() {
    this.unitConversationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
      operator: [''],
      value: [''],
      parentId: ['']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCountryChange(unit: any) {
    if (unit) {
      this.isOperator = true;
    }
  }

  unitConversationsList() {
    this.sub$.sink = this.unitConversationService.getUnitOperator()
      .subscribe(f => this.unitOperatorslist = [...f]);
  }

  saveUnitConversation(): void {
    if (!this.unitConversationForm.valid) {
      this.unitConversationForm.markAllAsTouched();
      return;
    }
    const unitConversation: UnitConversation = this.unitConversationForm.value;
    if (this.data.unitdata.id) {
      this.unitConversationService.updateUnitConversation(this.data.unitdata.id, unitConversation).subscribe(c => {
        this.toastrService.success(this.translationService.getValue('UNIT_CONVERSATION_SAVED_SUCCESSFULLY.'));
        this.dialogRef.close(c);
      });
    } else {
      this.unitConversationService.saveUnitConversation(unitConversation).subscribe(c => {
        this.toastrService.success(this.translationService.getValue('UNIT_CONVERSATION_SAVED_SUCCESSFULLY.'));
        this.dialogRef.close(c);
      });
    }
  }
}

