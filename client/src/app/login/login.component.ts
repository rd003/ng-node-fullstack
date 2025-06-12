import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  template: `
    <div class="container d-flex justify-content-center align-items-center center-container">
    <div class="card p-4 shadow" style="min-width: 300px; max-width: 400px; width: 100%;">
      <h4 class="text-center mb-4">Login</h4>
      <form>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" placeholder="Enter email" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" placeholder="Password" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
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

}
