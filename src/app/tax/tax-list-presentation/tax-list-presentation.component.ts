import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Tax } from '@core/domain-classes/tax';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageTaxComponent } from '../manage-tax/manage-tax.component';

@Component({
  selector: 'app-tax-list-presentation',
  templateUrl: './tax-list-presentation.component.html',
  styleUrls: ['./tax-list-presentation.component.scss']
})
export class TaxListPresentationComponent extends BaseComponent implements OnInit {

  @Input() taxes: Tax[];
  @Input() loading: boolean = false;
  @Output() deleteTaxHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name','percentage'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    public translationService: TranslationService
  ) {
    super(translationService);
    this.getLangDir();
  }

  ngOnInit(): void {
  }

  deleteTax(tax: Tax): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU} :: ${tax.name}`).subscribe(isTrue => {
      if (isTrue) {
        this.deleteTaxHandler.emit(tax.id);
      }
    })
  }

  manageTax(tax: Tax): void {
    this.dialog.open(ManageTaxComponent, {
      width: '350px',
      direction:this.langDir,
      data: Object.assign({}, tax)
    });
  }
}
