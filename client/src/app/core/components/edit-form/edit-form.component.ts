import { ViewEncapsulation, Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService, CourseService } from '../../services/index';
import { Subscription } from 'rxjs';

import * as $ from 'jquery';

@Component({
	selector: 'edit-form',
	templateUrl: 'edit-form.component.html',
	styles: [require('./edit-form.component.scss')],
	providers: [],
	encapsulation: ViewEncapsulation.None
})
export class EditForm implements OnInit, OnDestroy {

	@Input() id: string;

  private element: any;

	private isEdit: boolean;

	private courseId: number;

	private title: string;
	private subTitle: string;
	private creationDate: string;
	private duration: string;

	private courseServiceSubscription: Subscription;

	constructor (private courseService: CourseService, private modalService: ModalService, private el: ElementRef) {
			this.element = $(el.nativeElement);
			modalService.editFormEvent.subscribe((course: any) => {
				this.isEdit = true;
				this.courseId = course.id;

				this.title = course.title;
				this.subTitle = course.subTitle;
				this.creationDate = course.creationDate;
				this.duration = course.duration;
			});
			modalService.addFormEvent.subscribe(() => this.isEdit = false);
	}
	
	ngOnInit(): void {
    let modal = this;

		this.element.appendTo('body');
		this.modalService.add(this);
  }

	ngOnDestroy() {
		this.courseServiceSubscription.unsubscribe();
	}

	open(): void {
		this.element.show();
		$('body').addClass('modal-open');
	}

	close(): void {
		this.element.hide();
		$('body').removeClass('modal-open');
	}

	onEditButtonClick () {
		let data = {
			id: this.courseId,
			title: this.title,
			subTitle: this.subTitle,
			creationDate: this.creationDate,
			duration: this.duration
		}
		this.courseServiceSubscription = this.courseService.editCourseItem(data)
			.subscribe(() => {
				this.onCancelButtonClick('edit-form');
			});
	}

	onOkButtonClick () {
		let data = {
			title: this.title,
			subTitle: this.subTitle,
			creationDate: this.creationDate,
			duration: this.duration
		}
		this.courseServiceSubscription = this.courseService.postCourseItem(data)
			.subscribe(() => {
				this.onCancelButtonClick('edit-form');
			});
	}

	onCancelButtonClick (id: string) {
		this.title = '';
		this.subTitle = '';
		this.creationDate = '';
		this.duration = '';
		this.modalService.close(id);
	}
}