import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service.service';
@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.authService
      .getSupabase()
      .auth.signInWithPassword({
        email: this.username,
        password: this.password,
      })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error:', error.message);
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
