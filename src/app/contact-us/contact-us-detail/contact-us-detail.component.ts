import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactUs } from '@core/domain-classes/contact-us';

@Component({
  selector: 'app-contact-us-detail',
  templateUrl: './contact-us-detail.component.html',
  styleUrls: ['./contact-us-detail.component.scss']
})
export class ContactUsDetailComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public contactUs: ContactUs,
    public dialogRef: MatDialogRef<ContactUsDetailComponent>,
  ) { }

  ngOnInit(): void {

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
