import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../user/user.service';
import { UserStore } from '../user.store';

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
      <a (click)="logout()" style="cursor:pointer">Logout</a>
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
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);

  logout() {
    this.userService.logout().subscribe(
      {
        next: () => {
          this.userStore.logout();
          this.router.navigate([`/login`]);

        },
        error: (error) => console.log(error)
      }
    );

  }
}
