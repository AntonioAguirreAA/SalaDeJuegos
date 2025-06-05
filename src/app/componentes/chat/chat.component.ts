import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { Subscription } from 'rxjs';
import { Mensaje } from '../models/mensaje';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatForm: FormGroup;
  mensajes: Mensaje[] = [];
  currentUserEmail: string | null = null;
  private supabase: SupabaseClient;
  private sub: Subscription | null = null;

  @ViewChild('chatBox') chatBoxRef!: ElementRef;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.supabase = this.authService.getSupabase();

    this.chatForm = this.fb.group({
      mensaje: [''],
    });
  }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.currentUserEmail = user?.email || null;

    await this.loadMensajes();

    this.supabase
      .channel('mensajes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mensajes',
        },
        (payload) => {
          const nuevo = payload.new as Mensaje;
          this.mensajes.push({
            ...nuevo,
            fecha: new Date(nuevo.fecha).toLocaleString(),
          });
        }
      )
      .subscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.supabase.removeAllChannels();
  }

  private scrollToBottom() {
    const el = this.chatBoxRef?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  async loadMensajes() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('fecha', { ascending: true });

    if (data) {
      this.mensajes = data.map((m: Mensaje) => ({
        ...m,
        fecha: new Date(m.fecha).toLocaleString(),
      }));
    } else {
      console.error('Error cargando mensajes:', error);
    }
  }

  async sendMessage() {
    if (this.chatForm.valid && this.currentUserEmail) {
      const mensaje = this.chatForm.get('mensaje')?.value;

      const { data, error } = await this.supabase
        .from('mensajes')
        .insert({
          user: this.currentUserEmail,
          mensaje: mensaje,
        })
        .select('*'); // Importante para obtener el registro insertado

      if (error) {
        console.error('Error al enviar mensaje:', error);
      } else {
        this.chatForm.reset();
      }
    }
  }
}
