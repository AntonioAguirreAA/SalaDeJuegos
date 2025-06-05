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
      const supabase = this.authService.getSupabase();

      // ✅ Verificamos si el email ya está registrado en la tabla users-data
      const { data: existingUsers, error: checkError } = await supabase
        .from('users-data')
        .select('email')
        .eq('email', this.username);

      if (checkError) {
        throw checkError;
      }

      if (existingUsers.length > 0) {
        Swal.fire({
          title: 'Correo ya registrado',
          text: 'Ya existe una cuenta con este correo electrónico.',
          icon: 'error',
        });
        return;
      }

      // ✅ Registro en auth
      const { data, error } = await supabase.auth.signUp({
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
        throw error;
      }

      let filePath = '';

      if (this.avatarFile && data.user) {
        filePath = `users/${data.user.id}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from('fotos')
          .upload(filePath, this.avatarFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('fotos')
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

      // ✅ Insertar en users-data (ahora también con el email)
      if (data.user) {
        await supabase.from('users-data').insert({
          authId: data.user.id,
          name: this.name,
          age: this.age,
          email: this.username, // 👈 se guarda el email
          avatarUrl: filePath,
        });
      }

      Swal.fire({
        title: 'Registro exitoso',
        text: 'Confirmá tu cuenta antes de iniciar sesion',
        icon: 'success',
      });

      this.router.navigate(['/']);
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: 'Error',
        text: 'Algo salió mal al registrarte.',
        icon: 'info',
      });
    }
  }
}
