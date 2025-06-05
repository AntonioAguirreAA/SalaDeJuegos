import { Component, OnInit } from '@angular/core';
import { PuntajeService } from '../../../servicios/puntaje.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayormenor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayormenor.component.html',
  styleUrls: ['./mayormenor.component.scss'],
})
export class MayormenorComponent implements OnInit {
  mazo: string[] = [];
  cartaActual: string | null = null;
  cartaSiguiente: string | null = null;
  puntos = 0;
  juegoTerminado = false;

  constructor(private puntajeService: PuntajeService) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.juegoTerminado = false;
    this.puntos = 0;
    this.generarMazo();
    this.cartaActual = this.sacarCarta();
    this.cartaSiguiente = null;
  }

  generarMazo() {
    const valores = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      'J',
      'Q',
      'K',
    ];
    this.mazo = this.shuffle(
      valores.map(
        (valor) => `https://deckofcardsapi.com/static/img/${valor}H.png`
      )
    );
  }

  shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  sacarCarta(): string | null {
    return this.mazo.pop() || null;
  }

  async adivinar(opcion: string) {
    if (this.juegoTerminado) return;

    this.cartaSiguiente = this.sacarCarta();
    if (!this.cartaActual || !this.cartaSiguiente) return;

    const actual = this.extraerValorDeCarta(this.cartaActual);
    const siguiente = this.extraerValorDeCarta(this.cartaSiguiente);

    const acierto =
      (opcion === 'mayor' && siguiente > actual) ||
      (opcion === 'menor' && siguiente < actual);

    if (acierto) {
      this.puntos++;
      this.cartaActual = this.cartaSiguiente;
      this.cartaSiguiente = null;
    } else {
      // Perdiste
      this.juegoTerminado = true;
      await this.puntajeService.guardarPuntaje('Mayor Menor', this.puntos);
    }
  }

  extraerValorDeCarta(cartaUrl: string): number {
    const nombre = cartaUrl.split('/').pop();
    const valor = nombre?.substring(0, nombre.indexOf('H'));

    switch (valor) {
      case 'A':
        return 1;
      case '0':
        return 10;
      case 'J':
        return 11;
      case 'Q':
        return 12;
      case 'K':
        return 13;
      default:
        return parseInt(valor || '0', 10);
    }
  }
}
