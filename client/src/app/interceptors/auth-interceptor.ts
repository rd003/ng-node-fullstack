import { HttpInterceptorFn } from '@angular/common/http';

// If user is using unauthorized or expired token, then we will redirect it to login page
export const authInterceptor: HttpInterceptorFn = (req, next) => {

    return next(req);
};
