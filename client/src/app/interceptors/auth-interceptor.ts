import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
import { UserStore } from '../shared/user.store';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

// If user is using unauthorized or expired token, then we will redirect it to login page
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const userService = inject(UserService);
    const userStore = inject(UserStore);

    // avoid infinite loop
    if (req.url.includes('/auth/refresh') || req.url.includes('/auth/login')) {
        return next(req);
    }

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 403) {
                router.navigate(['/login']);
            }

            if (error.status === 401) {
                return handle401Error(req, next, router, userService, userStore);
            }
            return throwError(() => error);
        })
    )
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, router: Router, userService: UserService, userStore: UserStore): Observable<any> {
    if (isRefreshing) {
        return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(() => next(req))
        );
    }

    // Start refresh process
    isRefreshing = true;
    refreshTokenSubject.next(null);

    // Attempt to refresh the token
    return userService.refreshToken().pipe(
        switchMap((tokenResponse) => {
            // Refresh successful
            isRefreshing = false;
            refreshTokenSubject.next(tokenResponse);

            // Update user store if needed
            userStore.loadUserStore();

            // Retry the original request
            return next(req);
        }),
        catchError((refreshError) => {
            // Refresh failed - logout user
            isRefreshing = false;
            refreshTokenSubject.next(null);

            // Clear user data and redirect to login
            userStore.logout();
            router.navigate(['/login']);

            return throwError(() => refreshError);
        }),
        finalize(() => {
            isRefreshing = false;
        })
    );
}

