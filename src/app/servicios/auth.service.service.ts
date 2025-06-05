// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../componentes/models/user-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.publicAnonKey);
    this.supabase.auth.getUser().then(({ data }) => {
      this.userSubject.next(data.user);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
    });
  }

  getSupabase(): SupabaseClient {
    return this.supabase;
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  logout() {
    return this.supabase.auth.signOut();
  }

  async logLogin(user: User) {
    const { error } = await this.supabase.from('login_logs').insert({
      user_id: user.id,
      email: user.email,
    });

    if (error) {
      console.error('Error al registrar login:', error.message);
    }
  }

  // auth.service.ts

  async getUserData(): Promise<UserData | null> {
    const session = this.supabase.auth.getSession();
    const user = (await session).data.session?.user;

    if (!user) return null;

    const { data, error } = await this.supabase
      .from('users-data')
      .select('*')
      .eq('authId', user.id)
      .single();

    if (error) {
      console.error('Error al obtener perfil:', error.message);
      return null;
    }

    return data as UserData;
  }
}
