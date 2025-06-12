import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  template: `
  <div class="app-container">
    @if(isLoggedIn){
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
  isLoggedIn = true;

}
