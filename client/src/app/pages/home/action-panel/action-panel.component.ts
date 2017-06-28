import { Component, ViewEncapsulation } from '@angular/core';
import { ModalService, CourseService } from '../../../core/services/index';

import { CourseItem } from '../../../core/entities';

import { Subscription } from 'rxjs';

@Component({
	selector: 'action-panel',
	templateUrl: 'action-panel.component.html',
	styles: [require('./action-panel.component.scss')],
	providers: [],
	encapsulation: ViewEncapsulation.None
})
export class ActionPanelComponent {

	private query: string = '';
	private isSearch: boolean = false;

	private courseServiceSubscription: Subscription;

	constructor (private modalService: ModalService, private courseService: CourseService) {
	}

	onAddButtonClick (id: string) {
		this.modalService.open(id, false);
	}

	onSearchButtonClick () {
		this.courseServiceSubscription = this.courseService.searchCourses(this.query)
			.subscribe((res: CourseItem[]) => {
				this.isSearch = (this.query !== '');
				this.query = '';
			});
	}

	onBackButtonClick () {
		this.courseServiceSubscription = this.courseService.searchCourses('')
			.subscribe((res: CourseItem[]) => {
				this.isSearch = false;
			});
	}
}
