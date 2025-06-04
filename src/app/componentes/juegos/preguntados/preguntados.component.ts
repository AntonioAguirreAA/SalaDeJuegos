import { Component, OnInit } from '@angular/core';
import { PaisesService } from '../../../servicios/paises.service';
import { PuntajeService } from '../../../servicios/puntaje.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  providers: [PaisesService, PuntajeService],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss'],
})
export class PreguntadosComponent implements OnInit {
  public banderaPais: string = '';
  public respuestaCorrecta: string = '';
  public opciones: string[] = [];
  public todosLosPaises: any[] = [];
  mensaje: string = '';
  cargando: boolean = false;
  puntos: number = 0; // Puntaje de la sesión actual
  puntaje: number = 0; // Puntaje global acumulado
  juegoEmpezado: boolean = false;

  constructor(
    private paisesService: PaisesService,
    private puntajeService: PuntajeService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarPuntaje(); // Cargar el puntaje global al iniciar
    this.iniciarJuego();
  }

  async cargarPuntaje(): Promise<void> {
    this.puntaje = await this.puntajeService.obtenerPuntaje('preguntados');
  }

  iniciarJuego(): void {
    this.cargando = true;
    this.juegoEmpezado = true;
    this.puntos = 0; // Reiniciar puntos de la sesión
    this.cargarPaises();
  }

  cargarPaises(): void {
    this.paisesService.getPaises().subscribe({
      next: (data) => {
        this.todosLosPaises = data;
        this.generarPregunta();
      },
      error: () => {
        this.mensaje = 'Error al cargar los países. Intenta nuevamente.';
        this.cargando = false;
      },
    });
  }

  generarPregunta(): void {
    const indiceAleatorio = Math.floor(
      Math.random() * this.todosLosPaises.length
    );
    const paisElegido = this.todosLosPaises[indiceAleatorio];

    this.banderaPais = paisElegido.flags.png;
    this.respuestaCorrecta = paisElegido.name.common;

    const opcionesIncorrectas =
      this.generarOpcionesIncorrectas(indiceAleatorio);
    this.opciones = this.mezclarOpciones([
      this.respuestaCorrecta,
      ...opcionesIncorrectas,
    ]);
    this.cargando = false;
  }

  generarOpcionesIncorrectas(indiceRespuestaCorrecta: number): string[] {
    const respuestasIncorrectas: string[] = [];
    while (respuestasIncorrectas.length < 2) {
      const indiceAleatorio = Math.floor(
        Math.random() * this.todosLosPaises.length
      );
      if (
        indiceAleatorio !== indiceRespuestaCorrecta &&
        !respuestasIncorrectas.includes(
          this.todosLosPaises[indiceAleatorio].name.common
        )
      ) {
        respuestasIncorrectas.push(
          this.todosLosPaises[indiceAleatorio].name.common
        );
      }
    }
    return respuestasIncorrectas;
  }

  mezclarOpciones(opciones: string[]): string[] {
    return opciones.sort(() => Math.random() - 0.5);
  }

  async adivinarPais(respuestaSeleccionada: string): Promise<void> {
    if (respuestaSeleccionada === this.respuestaCorrecta) {
      this.puntos++;
      this.mensaje = `¡Correcto! Puntos de esta sesión: ${this.puntos}`;
      await this.actualizarPuntaje(1);
      this.generarPregunta();
    } else {
      this.mensaje = `El país correcto era: ${this.respuestaCorrecta}. Se restó 1 punto.`;
      await this.actualizarPuntaje(-2);
      this.generarPregunta();
    }
  }

  async actualizarPuntaje(cambio: number): Promise<void> {
    const nuevoPuntaje = Math.max(0, this.puntaje + cambio);
    this.puntaje = nuevoPuntaje;

    await this.puntajeService.guardarPuntaje('preguntados', this.puntaje);
    console.log('Puntaje global actualizado:', this.puntaje);
  }
}
