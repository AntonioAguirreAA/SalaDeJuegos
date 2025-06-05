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
  puntos: number = 0;
  juegoEmpezado: boolean = true;
  juegoTerminado: boolean = false;

  constructor(
    private paisesService: PaisesService,
    private puntajeService: PuntajeService
  ) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.juegoEmpezado = true;
    this.juegoTerminado = false;
    this.puntos = 0;
    this.mensaje = '';
    this.cargarPaises();
  }

  cargarPaises(): void {
    this.cargando = true;
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
    const indice = Math.floor(Math.random() * this.todosLosPaises.length);
    const pais = this.todosLosPaises[indice];
    this.banderaPais = pais.flags.png;
    this.respuestaCorrecta = pais.name.common;

    const opcionesIncorrectas = this.generarOpcionesIncorrectas(indice);
    this.opciones = this.mezclarOpciones([
      this.respuestaCorrecta,
      ...opcionesIncorrectas,
    ]);
    this.cargando = false;
  }

  generarOpcionesIncorrectas(correctIndex: number): string[] {
    const opciones: string[] = [];
    while (opciones.length < 2) {
      const indice = Math.floor(Math.random() * this.todosLosPaises.length);
      const nombre = this.todosLosPaises[indice].name.common;
      if (indice !== correctIndex && !opciones.includes(nombre)) {
        opciones.push(nombre);
      }
    }
    return opciones;
  }

  mezclarOpciones(opciones: string[]): string[] {
    return opciones.sort(() => Math.random() - 0.5);
  }

  async adivinarPais(respuesta: string): Promise<void> {
    if (respuesta === this.respuestaCorrecta) {
      this.puntos++;
      this.mensaje = `¡Correcto! Llevás ${this.puntos} puntos.`;
      this.generarPregunta();
    } else {
      this.mensaje = `¡Incorrecto! Era: ${this.respuestaCorrecta}.`;
      this.juegoTerminado = true;
      this.juegoEmpezado = false;
      await this.puntajeService.guardarPuntaje('Preguntados', this.puntos);
    }
  }

  reiniciarJuego(): void {
    this.iniciarJuego();
  }
}
