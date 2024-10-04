import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Input() appDragDrop: string;
  @Output() onFileDropped = new EventEmitter<Array<any>>();
  fileOver: boolean = false;
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    // Dragover listener @HostListener('dragover', ['$event']) onDragover (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log('Drag over');
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {

    // Dragleave listener @HostListener('dragleave', ['$event']) public onDragLeave (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log('Drag Leave');
  }

  @HostListener('drop', ['$event']) onDrop(evt) {
    // Drop listener @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
      // Do Some stuff here console.log('You dropped ${files.length} files. );

    }
  }
}
