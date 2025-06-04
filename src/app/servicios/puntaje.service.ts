// src/app/services/puntaje.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class PuntajeService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = this.authService.getSupabase();
  }

  private getUserEmail(): string | null {
    return this.authService.getCurrentUser()?.email ?? null;
  }

  private getUserId(): string | null {
    return this.authService.getCurrentUser()?.id ?? null;
  }

  // Guardar SIEMPRE un nuevo puntaje sin verificar si hay registros anteriores
  async guardarPuntaje(juego: string, puntos: number): Promise<void> {
    const userId = this.getUserId();
    const email = this.getUserEmail();
    if (!userId || !email) {
      console.error('Error: Usuario no autenticado');
      return;
    }

    const { error } = await this.supabase
      .from('puntajes')
      .insert([{ user_id: userId, email, juego, puntos }]);

    if (error) {
      console.error(
        `Error al insertar puntaje para "${juego}":`,
        error.message
      );
    } else {
      console.log(`Puntaje insertado correctamente para "${juego}"`);
    }
  }

  // Obtener puntaje de un juego (último o primero registrado)
  async obtenerPuntaje(juego: string): Promise<number> {
    const userId = this.getUserId();
    if (!userId) {
      console.error('Error: Usuario no autenticado');
      return 0;
    }

    const { data, error } = await this.supabase
      .from('puntajes')
      .select('puntos')
      .eq('user_id', userId)
      .eq('juego', juego);

    if (error) {
      console.error(`Error al obtener puntaje para "${juego}":`, error.message);
      return 0;
    }

    if (!data || data.length === 0) {
      console.log(`No se encontró puntaje para "${juego}"`);
      return 0;
    }

    const ultimoPuntaje = data[data.length - 1].puntos;
    console.log(`Puntaje obtenido para "${juego}":`, ultimoPuntaje);
    return ultimoPuntaje;
  }

  // Obtener todos los puntajes del usuario
  async obtenerTodosLosPuntajes(): Promise<
    { juego: string; puntos: number }[]
  > {
    const userId = this.getUserId();
    if (!userId) {
      console.error('Error: Usuario no autenticado');
      return [];
    }

    const { data, error } = await this.supabase
      .from('puntajes')
      .select('juego, puntos')
      .eq('user_id', userId);

    if (error) {
      console.error('Error al obtener todos los puntajes:', error.message);
      return [];
    }

    console.log('Todos los puntajes obtenidos:', data);
    return data ?? [];
  }
}
