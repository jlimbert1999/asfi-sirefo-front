import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AsfiCredentialsService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/asfi-crendentials`;

  private _email = signal<string | null>(null);
  email = computed(() => this._email());

  constructor() {
    const saved = localStorage.getItem('asfi-email');
    this._email.set(saved);
  }

  checkCredentials(): Observable<boolean> {
    return this.http.get<{ email: string }>(this.URL).pipe(
      tap(({ email }) => this.setVerification(email)),
      map(() => true),
      catchError(() => {
        this.removeVerification();
        return of(false);
      })
    );
  }

  setCredentials(asfiUsername: string, asfiPassword: string) {
    return this.http
      .patch<{ email: string }>(this.URL, {
        asfiUsername,
        asfiPassword,
      })
      .pipe(tap(({ email }) => this.setVerification(email)));
  }

  validateCredentials(asfiUsername: string, asfiPassword: string) {
    return this.http.post(`${this.URL}/validate`, { asfiUsername, asfiPassword });
  }

  private setVerification(email: string) {
    localStorage.setItem('asfi-email', email);
    this._email.set(email);
  }

  private removeVerification() {
    localStorage.removeItem('asfi-email');
    this._email.set(null);
  }
}
