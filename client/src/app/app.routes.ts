import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: async () => (await import("./dashboard.component")).DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'people',
        loadComponent: async () => (await import("./person/person.component")).PersonComponent
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
