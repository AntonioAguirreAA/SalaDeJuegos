// src/app/components/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  autocompletarLogin() {
    this.loginForm.patchValue({
      email: 'admin@test.com',
      password: '123456',
    });
  }

  async login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    const { data, error } = await this.authService
      .getSupabase()
      .auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      Swal.fire('Error', 'Error al iniciar sesión', 'error');
    } else {
      // ✅ Registrar login en la tabla
      await this.authService.logLogin(data.user);
      this.router.navigate(['/home']);
    }
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}
