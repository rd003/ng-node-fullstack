import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
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

  get f() {
    return this.loginForm.controls;
  }

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })

  onSubmit() {

  }
}
