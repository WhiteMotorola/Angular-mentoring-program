import { Injectable, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response, Request, RequestOptions, RequestMethod, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import { LoginService } from '../loginService/login.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CourseItem } from '../../entities';

@Injectable()
export class CourseService implements OnInit {

	@Output() addEvent: EventEmitter <any> = new EventEmitter();
	@Output() deleteEvent: EventEmitter <any> = new EventEmitter();
	@Output() editEvent: EventEmitter <any> = new EventEmitter();
	@Output() searchEvent: EventEmitter <any> = new EventEmitter();

	private courseListUrl: string = 'courses';
	private headers: Headers;
	private options: RequestOptions;

	constructor (private http: Http, private loginService: LoginService, private router: Router, private route: ActivatedRoute) {
		loginService.authTokenEvent.subscribe(() => {
			this.setHeaders();
			loginService.isAuthenticated()
				? this.router.navigate(['/home'], { relativeTo: this.route })
				: this.router.navigate(['/'], { relativeTo: this.route });
		});
	}

	private errorHandler (error: any) {
		if (error.status === 440) {
			this.loginService.logout();
			this.router.navigate(['/440'], { relativeTo: this.route });
			return 'Token expired';
		}
	}

	public setHeaders () {
		this.headers = new Headers({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + sessionStorage.getItem('oauth_token')
		});
		this.options = new RequestOptions({ headers: this.headers });
	}

	public ngOnInit () {

	}

	public getCourseItems (): Observable <CourseItem[]> {
		return this.http.get(this.courseListUrl, this.options)
			.map((response: Response) => response.json())
			.map((courseItems: CourseItem[]) => {
				return courseItems;
			}).catch((error) => {
        return Observable.throw(this.errorHandler(error));
      });
	}

	public postCourseItem (data: any) {
		let courseItem = new CourseItem(data.title, data.subTitle, data.creationDate, data.duration);
		return this.http.post(this.courseListUrl, courseItem, this.options)
			.map(() => this.addEvent.emit(courseItem))
			.catch((error) => {
        return Observable.throw(this.errorHandler(error));
      });
	}

	public deleteCourseItem (id: any) {
		const url = `${this.courseListUrl}/${id}`;
		return this.http.delete(url, this.options)
			.map(() => this.deleteEvent.emit(id))
			.catch((error) => {
        return Observable.throw(this.errorHandler(error));
      });
	}

	public editCourseItem (data: any) {
		const url = `${this.courseListUrl}/${data.id}`;
		return this.http.put(url, data, this.options)
			.map(() => this.editEvent.emit(data))
			.catch((error) => {
        return Observable.throw(this.errorHandler(error));
      });
	}

	public searchCourses (query: string) {
		const url = `${this.courseListUrl}?q=${query}`;
		return this.http.get(url, this.options)
			.map((response: Response) => response.json())
			.map((courseItems: CourseItem[]) => {
				this.searchEvent.emit(courseItems);
				return courseItems;
			})
			.catch((error) => {
        return Observable.throw(this.errorHandler(error));
      });
	}
}
