import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// If user is using unauthorized or expired token, then we will redirect it to login page
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401 || error.status === 403) {
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    )
};
