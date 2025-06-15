import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from '../shared/user.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  //console.log('Auth guard - isLoading:', userStore.isLoading());
  //console.log('Auth guard - username:', userStore.username());

  // If still loading, wait for it to complete
  if (userStore.isLoading()) {
    return toObservable(userStore.isLoaded).pipe(
      filter(loaded => loaded), // Wait until loading is complete
      take(1),
      map(() => {
        // console.log('Auth guard - after loading - username:', userStore.username());
        if (!userStore.username()) {
          console.log("not logged in, visited route: " + state.url);
          router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
        return true;
      })
    );
  }

  // If not loading, check immediately
  if (!userStore.username()) {
    // console.log("not logged in, visited route: " + state.url);
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;

};
