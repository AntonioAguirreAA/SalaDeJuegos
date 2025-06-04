import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  username: string = '';
  password: string = '';
  name: string = '';
  age: number | null = null;
  avatarFile: File | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.avatarFile = input.files[0];
    }
  }

  async register() {
    try {
      const { data, error } = await this.authService.getSupabase().auth.signUp({
        email: this.username,
        password: this.password,
        options: {
          data: {
            name: this.name,
            age: this.age,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          Swal.fire({
            title: 'Error',
            text: 'El correo ya estaba registrado.',
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
          });
        }
        return;
      }

      if (this.avatarFile && data.user) {
        const supabase = this.authService.getSupabase();
        const filePath = `avatars/${data.user.id}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, this.avatarFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

          if (publicUrlData.publicUrl) {
            await supabase.auth.updateUser({
              data: {
                avatar_url: publicUrlData.publicUrl,
              },
            });
          }
        }
      }

      Swal.fire({
        title: 'Registro exitoso',
        text: 'Ahora podés iniciar sesión.',
        icon: 'success',
      });

      this.router.navigate(['/']);
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: 'Algo salió mal al registrarte.',
        icon: 'error',
      });
    }
  }
}
