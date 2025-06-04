import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './servicios/auth.service.service';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  user$: Observable<User | null>;
  enChat: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
