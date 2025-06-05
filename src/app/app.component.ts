import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './servicios/auth.service.service';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { UserData } from './componentes/models/user-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  user$: Observable<User | null>;
  userData: UserData | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;

    this.user$.subscribe(async (user) => {
      if (user) {
        this.userData = await this.authService.getUserData();
      } else {
        this.userData = null;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  getAvatarUrl(): string {
    if (!this.userData?.avatarUrl) {
      return 'assets/default-avatar.png'; // Imagen local por defecto
    }

    return `https://bbdtxmrsanmjjhutysbj.supabase.co/storage/v1/object/public/fotos/${this.userData.avatarUrl}`;
  }
}
