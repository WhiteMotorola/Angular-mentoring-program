import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from '../../core/services';
import { Subscription } from 'rxjs';

@Component({
	selector: 'login',
	encapsulation: ViewEncapsulation.None,
	providers: [],
	styles: [require('./login.styles.scss')],
	template: require('./login.template.html')
})
export class LoginComponent implements OnInit, OnDestroy {

	private username: string;
	private password: string;
	private unauthorized: boolean;

	private loginServiceSubscription: Subscription;

  constructor (private loginService: LoginService, private router: Router, private route: ActivatedRoute) {

	}

	public ngOnInit () {
		if (this.loginService.isExpired()) {
			this.loginService.logout();
		}
		if (this.loginService.isAuthenticated()) {
			this.router.navigate(['/home'], { relativeTo: this.route });
		} else {
			this.router.navigate(['/'], { relativeTo: this.route });
		}
	}
	
	public onLoginButtonClick () {
		let user = { username: this.username, password: this.password };
		this.loginServiceSubscription = this.loginService.login(user).subscribe(() => { this.unauthorized = false; }, (err) => {
			if (err === 'Unauthorized') {
				this.unauthorized = true;
			}
		});
	}

	public ngOnDestroy () {
		if (this.loginServiceSubscription) {
			this.loginServiceSubscription.unsubscribe();
		}
	}
}