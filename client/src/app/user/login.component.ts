import { Component, DestroyRef, inject, WritableSignal, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { LoginModel } from './models/login.model';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TokenModel } from './models/token.model';
import { tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <!-- loading  -->
    @if(loading()){
       <div class="alert alert-info">Loading....</div>
    }

    <!-- error message -->
     @if(error()){
        <div class="alert alert-danger">{{error()?.message}}</div>
     }

    <!-- message -->
     @if(message()) {
        <div class="alert alert-info">{{message()}}</div>
     }

    <div class="container d-flex justify-content-center align-items-center center-container">
    <div class="card p-4 shadow" style="min-width: 300px; max-width: 400px; width: 100%;">
      <h4 class="text-center mb-4">Login</h4>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="username" class="form-label" >Username</label>
          <input formControlName="username" class="form-control" placeholder="Enter username" required />

          @if(f.username.touched || (f.username.dirty && f.username.invalid))
          {
             @if(f.username.errors?.['required']){
                   <span>Please fill the username</span>
             }
          }
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input formControlName="password" type="password" class="form-control" id="password" placeholder="Password" required />

          @if(f.password.touched || (f.password.dirty && f.password.invalid))
          {
             @if(f.password.errors?.['required']){
                   <span>Please fill the password</span>
             }
          }
        </div>
        <button type="submit" class="btn btn-primary w-100" [disabled]="loginForm.invalid">Login</button>
      </form>
    </div>
  </div>
  `,
  styles: [
    `
    .center-container {
      height: 100vh;
    }
    `
  ]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  loading = signal(false);
  error: WritableSignal<HttpErrorResponse | null> = signal(null);
  message = signal("");

  get f() {
    return this.loginForm.controls;
  }

  loginForm = this.fb.group({
    username: ['john@example.com', Validators.required],
    password: ['John@123', Validators.required],
  })

  private resetStates() {
    this.loading.update(() => false);
    this.error.update(() => null);
    this.message.update(() => "");
  }

  onSubmit() {
    this.resetStates();
    this.userService.login(this.loginForm.value as LoginModel).pipe(
      tap(() => this.loading.update(() => true)),
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (token: TokenModel) => {
          this.message.update(() => "Logged in successfull");
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log(error);
          this.error.update(() => error);
        },
        complete: () => {
          this.loading.update(() => false);
        }
      });
  }
}
