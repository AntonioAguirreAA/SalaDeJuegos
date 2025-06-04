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

  // Guardar o actualizar puntaje por juego
  async guardarPuntaje(juego: string, puntos: number): Promise<void> {
    const userId = this.getUserId();
    const email = this.getUserEmail();
    if (!userId || !email) return;

    // Buscar si ya hay un registro para ese juego y usuario
    const { data, error } = await this.supabase
      .from('puntajes')
      .select('*')
      .eq('user_id', userId)
      .eq('juego', juego)
      .single();

    if (data) {
      // Actualizar si existe
      await this.supabase.from('puntajes').update({ puntos }).eq('id', data.id);
    } else {
      // Insertar si no existe
      await this.supabase
        .from('puntajes')
        .insert([{ user_id: userId, email, juego, puntos }]);
    }
  }

  // Obtener puntaje de un juego
  async obtenerPuntaje(juego: string): Promise<number> {
    const userId = this.getUserId();
    if (!userId) return 0;

    const { data, error } = await this.supabase
      .from('puntajes')
      .select('puntos')
      .eq('user_id', userId)
      .eq('juego', juego)
      .single();

    return data?.puntos ?? 0;
  }

  // Obtener todos los puntajes del usuario
  async obtenerTodosLosPuntajes(): Promise<
    { juego: string; puntos: number }[]
  > {
    const userId = this.getUserId();
    if (!userId) return [];

    const { data, error } = await this.supabase
      .from('puntajes')
      .select('juego, puntos')
      .eq('user_id', userId);

    return data ?? [];
  }
}
