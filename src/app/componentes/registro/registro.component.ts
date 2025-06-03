import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service.service';

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
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
      console.error('Error:', error.message);
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

    this.router.navigate(['/']);
  }
}
