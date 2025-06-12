import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterModule],
  template: `
   <div class="wrapper">
    <!-- Sidebar -->
    <nav class="sidebar">
      <h5 class="text-white">Admin Panel</h5>
      <a href="/dashboard">Dashboard</a>
      <a href="/people">People</a>
      <a href="/logout">Logout</a>
    </nav>

    <!-- Main Content -->
    <div class="content">
      <router-outlet/>
    </div>
  </div>
  `,
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
