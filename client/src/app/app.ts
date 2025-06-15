import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { UserStore } from './shared/user.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  template: `
  <div class="app-container">
    @if(username().length>0){
      <!-- user is logged in -->
      <app-layout></app-layout>
    }
    @else{
      <router-outlet />
    }
    <!-- Footer -->
  <footer>
    Created by <a href="https://x.com/@ravi_devrani" target="_blank">Ravindra Devrani</a> 
  </footer>
 
</div>
  `,
  styles: [`
  :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    footer {
      margin-top: auto;
      background-color: #f1f1f1;
      text-align: center;
      padding: 0.75rem;
      font-size: 0.9rem;
    }
    `],
})
export class App {
  // Since service is registered in root (providedIn:root), it will share the instance globally
  private readonly userStore = inject(UserStore);
  username = this.userStore.username;

  // it just for solving timing issue, signal is not being updated for reaching at this class
  constructor() {
    effect(() => {
      const currentUsername = this.username();
      if (currentUsername) {
      }
    });
  }
}
