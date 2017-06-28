// angular modules
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// routes
import { routes } from './home.routes';

// custom components
import { HomeComponent } from './home.component';
import { CourseItemComponent } from './course-item/course-item.component';
import { ActionPanelComponent } from './action-panel/action-panel.component';
import { EditForm } from '../../core/components/edit-form/index';

@NgModule({
	declarations: [
		HomeComponent,
		CourseItemComponent,
		ActionPanelComponent,
		EditForm
	],
	imports: [
		routes,
		FormsModule,
		ReactiveFormsModule,
		CommonModule
	],
	providers: []
})
export class HomeModule {
	constructor() {
	}
}
