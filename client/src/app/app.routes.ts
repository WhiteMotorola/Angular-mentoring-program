import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { LoginComponent } from './pages/login';
import { NoContentComponent } from './pages/no-content';
import { SessionExpiredComponent } from './pages/440';

export const ROUTES: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'home', component: HomeComponent },
	{ path: '440', component: SessionExpiredComponent },
	{ path: '**', component: NoContentComponent },
];
