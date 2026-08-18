import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl ?? '/api';

  get<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}): Observable<T> {
    let query = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query = query.set(key, String(value));
    });
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: query });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }
}
