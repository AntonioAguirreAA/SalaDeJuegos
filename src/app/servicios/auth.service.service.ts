// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

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
}
