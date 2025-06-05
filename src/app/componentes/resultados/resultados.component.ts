import { Component, OnInit } from '@angular/core';
import { PuntajeService } from '../../servicios/puntaje.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss'],
})
export class ResultadosComponent implements OnInit {
  juegos = ['Ahorcado', 'Mayor Menor', 'Preguntados', 'Color Contraste'];
  resultados: {
    [key: string]: { email: string; puntos: number; created_at: string }[];
  } = {};

  constructor(private puntajeService: PuntajeService) {}

  async ngOnInit() {
    for (const juego of this.juegos) {
      const top = await this.puntajeService.obtenerTopPuntajesPorJuego(
        juego,
        5
      );
      this.resultados[juego] = top;
    }
  }
}
