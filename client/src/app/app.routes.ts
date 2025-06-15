import { Routes } from '@angular/router';
import { LoginComponent } from './user/login.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: async () => (await import("./dashboard.component")).DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'people',
        loadComponent: async () => (await import("./person/person.component")).PersonComponent,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: "/login",
        pathMatch: 'full',
    },
    {
        path: "**",
        loadComponent: async () => (await import('./not-found')).NotFound
    }
];
