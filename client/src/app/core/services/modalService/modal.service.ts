import { Output, EventEmitter, Injectable, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../loginService/login.service';
import { Router, ActivatedRoute } from '@angular/router';

import { without, find } from 'lodash';

@Injectable()
export class ModalService implements OnInit, OnDestroy {

  @Output() editFormEvent: EventEmitter <any> = new EventEmitter();
  @Output() addFormEvent: EventEmitter <any> = new EventEmitter();

  private modals: any[] = [];

  constructor (private loginService: LoginService, private router: Router, private route: ActivatedRoute) {

  }

  public ngOnInit () {

  }

  public ngOnDestroy () {
    this.modals = [];
  }

  public add (modal: any) {
    this.modals.push(modal);
  }

  public open (id: string, isEdit?: boolean, course?: any) {

    if (this.loginService.isExpired()) {
      this.router.navigate(['/440'], { relativeTo: this.route });
    } else {
      if (isEdit) {
        this.editFormEvent.emit(course);
      } else {
        this.addFormEvent.emit();
      }

      let modal = find(this.modals, { id: id });
      modal.open();
    }
  }

  public remove (id: string) {
    let modalToRemove = this.modals.filter((modal) => modal.id === id)[0];
    this.modals = without(this.modals, modalToRemove);
  }
}