import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, Request, RequestOptions, RequestMethod, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map';

import { CourseItem } from '../../entities';

@Injectable()
export class CourseService {

	@Output() addEvent: EventEmitter <any> = new EventEmitter();
	@Output() deleteEvent: EventEmitter <any> = new EventEmitter();
	@Output() editEvent: EventEmitter <any> = new EventEmitter();
	@Output() searchEvent: EventEmitter <any> = new EventEmitter();

	private courseListUrl: string = 'courses';

	constructor(private http: Http) {
	}

	public getCourseItems (): Observable <CourseItem[]> {
		return this.http.get(this.courseListUrl)
			.map((response: Response) => response.json())
			.map((courseItems: CourseItem[]) => {
				return courseItems;
			});
	}

	public postCourseItem (data: any) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let courseItem = new CourseItem(data.title, data.subTitle, data.creationDate, data.duration);
		return this.http.post(this.courseListUrl, courseItem, options)
			.map(() => this.addEvent.emit(courseItem));
	}

	public deleteCourseItem (id: any) {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		const url = `${this.courseListUrl}/${id}`;
		return this.http.delete(url, options)
			.map(() => this.deleteEvent.emit(id));
	}

	public editCourseItem (data: any) {
		const url = `${this.courseListUrl}/${data.id}`;
		return this.http.put(url, data)
			.map(() => this.editEvent.emit(data));
	}

	public searchCourses (query: string) {
		const url = `${this.courseListUrl}?q=${query}`;
		return this.http.get(url)
			.map((response: Response) => response.json())
			.map((courseItems: CourseItem[]) => {
				this.searchEvent.emit(courseItems);
				return courseItems;
			});
	}
}
