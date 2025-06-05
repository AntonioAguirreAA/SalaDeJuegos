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

  // Obtener los mejores puntajes de un juego
  async obtenerTopPuntajesPorJuego(
    juego: string,
    limite: number = 5
  ): Promise<{ email: string; puntos: number; created_at: string }[]> {
    const { data, error } = await this.supabase
      .from('puntajes')
      .select('email, puntos, created_at')
      .eq('juego', juego)
      .order('puntos', { ascending: false })
      .limit(limite);

    if (error) {
      console.error(
        `Error al obtener top puntajes de "${juego}":`,
        error.message
      );
      return [];
    }

    return data ?? [];
  }
}
