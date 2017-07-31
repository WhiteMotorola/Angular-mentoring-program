import { Component, ViewEncapsulation, Input } from '@angular/core';
import { CourseItem } from '../../../core/entities';

import { Subscription } from 'rxjs';

import { CourseService, ModalService } from '../../../core/services';

@Component({
	selector: 'course-item',
	templateUrl: 'course-item.component.html',
	styles: [require('./course-item.component.scss')],
	providers: [],
	encapsulation: ViewEncapsulation.None
})
export class CourseItemComponent {

	@Input() public course: CourseItem;

	private courseServiceSubscription: Subscription;

	constructor (private courseService: CourseService, private modalService: ModalService ) {
		
	}

	onDeleteButtonClick () {
		let id = this.course.id;
		this.courseServiceSubscription = this.courseService.deleteCourseItem(id).subscribe(() => null);
	}

	onEditButtonClick (id: string) {
		this.modalService.open(id, true, this.course);
	}
}
