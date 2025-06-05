import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class EncuestaComponent implements OnInit {
  encuestaForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      pregunta1: ['', Validators.required],
      juego1: [false],
      juego2: [false],
      juego3: [false],
      juego4: [false],
      pregunta3: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.encuestaForm.invalid) {
      this.encuestaForm.markAllAsTouched();
      return;
    }

    const formData = this.encuestaForm.value;

    const juegosSeleccionados: string[] = [];
    if (formData.juego1) juegosSeleccionados.push('Ahorcado');
    if (formData.juego2) juegosSeleccionados.push('Mayor Menor');
    if (formData.juego3) juegosSeleccionados.push('Preguntados');
    if (formData.juego4) juegosSeleccionados.push('Color Contraste');

    const user = this.authService.getCurrentUser();

    const respuesta = {
      user_id: user?.id ?? null,
      nombre: formData.nombre,
      edad: formData.edad,
      telefono: formData.telefono,
      gusto_app: formData.pregunta1,
      juegos: juegosSeleccionados,
      comentario: formData.pregunta3,
    };

    const supabase = this.authService.getSupabase();
    const { error } = await supabase
      .from('respuestas-encuesta')
      .insert(respuesta);

    if (error) {
      console.error('Error al guardar en Supabase:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar la encuesta.',
        confirmButtonColor: '#d33',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Encuesta enviada!',
        text: 'Gracias por completar la encuesta.',
        confirmButtonColor: '#3085d6',
      });
      this.encuestaForm.reset();
    }
  }
}
