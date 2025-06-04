import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags';

  constructor(private http: HttpClient) {}

  getPaises(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
