import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntajeService } from '../../../servicios/puntaje.service';

@Component({
  selector: 'app-colorcontraste',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './colorcontraste.component.html',
  styleUrl: './colorcontraste.component.scss',
})
export class ColorcontrasteComponent implements OnInit {
  colores: string[] = [];
  indiceDiferente: number = 0;
  puntos: number = 0;
  juegoTerminado: boolean = false;

  constructor(private puntajeService: PuntajeService) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.puntos = 0;
    this.juegoTerminado = false;
    this.generarColores();
  }

  generarColores(): void {
    const baseColor = this.colorAleatorio();
    const colorDistinto = this.colorSimilar(baseColor, 20); // tono diferente leve

    this.indiceDiferente = Math.floor(Math.random() * 4);
    this.colores = Array(4).fill(baseColor);
    this.colores[this.indiceDiferente] = colorDistinto;
  }

  elegir(indice: number): void {
    if (this.juegoTerminado) return;

    if (indice === this.indiceDiferente) {
      this.puntos++;
      this.generarColores();
    } else {
      this.juegoTerminado = true;
      this.puntajeService.guardarPuntaje('colorDiferente', this.puntos);
    }
  }

  colorAleatorio(): string {
    const r = this.randRGB();
    const g = this.randRGB();
    const b = this.randRGB();
    return `rgb(${r}, ${g}, ${b})`;
  }

  colorSimilar(color: string, diferencia: number): string {
    const match = color.match(/\d+/g);
    if (!match) return color;

    let [r, g, b] = match.map(Number);
    r = this.clamp(r + this.randomDiff(diferencia));
    g = this.clamp(g + this.randomDiff(diferencia));
    b = this.clamp(b + this.randomDiff(diferencia));

    return `rgb(${r}, ${g}, ${b})`;
  }

  randRGB(): number {
    return Math.floor(Math.random() * 256);
  }

  randomDiff(range: number): number {
    return Math.floor(Math.random() * (range * 2 + 1)) - range;
  }

  clamp(valor: number): number {
    return Math.max(0, Math.min(255, valor));
  }
}
