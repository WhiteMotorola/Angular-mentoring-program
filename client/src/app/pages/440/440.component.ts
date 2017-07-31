import { Component } from '@angular/core';

@Component({
	selector: 'session-expired',
	template: `
    <div>
      <h1>Session expired. Please, <a routerLink = "/" routerLinkActive = "active">log in</a> again.</h1>
    </div>
  `
})
export class SessionExpiredComponent {

}