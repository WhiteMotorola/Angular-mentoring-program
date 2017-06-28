import { Output, EventEmitter } from '@angular/core';

import { without, find } from 'lodash';

export class ModalService {

  @Output() editFormEvent: EventEmitter <any> = new EventEmitter();
  @Output() addFormEvent: EventEmitter <any> = new EventEmitter();

  private modals: any[] = [];

  add (modal: any) {
    this.modals.push(modal);
  }

  open (id: string, isEdit?: boolean, course?: any) {

    if (isEdit) {
      this.editFormEvent.emit(course);
    } else {
      this.addFormEvent.emit();
    }

    let modal = find(this.modals, { id: id });
    modal.open();
  }

  close(id: string) {
    let modal = find(this.modals, { id: id });
    modal.close();
  }
}