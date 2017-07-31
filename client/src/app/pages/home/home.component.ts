import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CourseService, LoginService } from '../../core/services';
import { CourseItem } from '../../core/entities';

import { without, find } from 'lodash';

@Component({
	selector: 'home',
	encapsulation: ViewEncapsulation.None,
	providers: [],
	styles: [require('./home.styles.scss')],
	template: require('./home.template.html')
})
export class HomeComponent implements OnInit, OnDestroy {
	private courseServiceSubscription: Subscription;

	private courseList: CourseItem[];
	private isLoading: boolean = false;
	private username: string;

	constructor (private courseService: CourseService, private loginService: LoginService, private router: Router, private route: ActivatedRoute) {
		this.courseList = [];

		courseService.addEvent.subscribe((data: any) => this.courseList.push(data));

		courseService.deleteEvent.subscribe((id: any) => {
			let courseToRemove = find(this.courseList, { id: id });
			this.courseList = without(this.courseList, courseToRemove);
		});

		courseService.editEvent.subscribe((data: any) => {
			let courseToEdit = find(this.courseList, { id: data.id });
			courseToEdit.title = data.title;
			courseToEdit.subTitle = data.subTitle;
			courseToEdit.creationDate = data.creationDate;
			courseToEdit.duration = data.duration;
		});

		courseService.searchEvent
			.subscribe((courseItems: any) => this.courseList = courseItems
			.sort((item1: any, item2: any) => item1.id - item2.id));
	}

	public ngOnInit() {
		if (this.loginService.isAuthenticated()) {
			this.username = this.loginService.getUserInfo();

			this.courseService.setHeaders();

			this.isLoading = true;
			this.courseServiceSubscription = this.courseService.getCourseItems().subscribe((res: CourseItem[]) => {
				this.courseList = res.sort((item1: any, item2: any) => item1.id - item2.id);
				this.isLoading = false;
			});
		} else {
			this.router.navigate(['/'], { relativeTo: this.route });
		}
	}

	public onLogoutButtonClick () {
		this.loginService.logout();
	}

	public ngOnDestroy() {
		if (this.courseServiceSubscription) {
			this.courseServiceSubscription.unsubscribe();
		}
	}
}
