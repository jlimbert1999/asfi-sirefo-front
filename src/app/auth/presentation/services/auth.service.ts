import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { jwtPayload, menu } from '../../infrastructure';
import { UPLOAD_INDICATOR } from '../../../core/interceptors/interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL: string = environment.apiUrl;
  private _user = signal<jwtPayload | null>(null);
  private _menu = signal<menu[]>([]);
  private _roles = signal<string[]>([]);
  private _updatedPassword = signal<boolean>(false);

  user = computed(() => this._user());
  menu = computed(() => this._menu());
  roles = computed(() => this._roles()!);
  updatedPassword = computed(() => this._updatedPassword());
  profileLetter = computed(() => this._user()?.fullName.charAt(0) ?? 'U');

  constructor(private http: HttpClient) {}

  login(login: string, password: string, remember = false) {
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    return this.http
      .post<{ token: string }>(
        `${this.URL}/auth`,
        {
          login,
          password,
        },
        { context: new HttpContext().set(UPLOAD_INDICATOR, false) }
      )
      .pipe(map(({ token }) => this._setAuthentication(token)));
  }

  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
    // this._permissions.set(null);
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        menu: menu[];
        updatedPassword: boolean;
        roles: string[];
      }>(`${this.URL}/auth`)
      .pipe(
        map(({ menu, token, updatedPassword, roles }) => {
          this._menu.set(menu);
          this._roles.set(roles);
          this._updatedPassword.set(updatedPassword);
          return this._setAuthentication(token);
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  updateMyUser(password: string) {
    return this.http
      .put<{ message: string }>(`${this.URL}/auth`, {
        password,
      })
      .pipe(tap(() => this._updatedPassword.set(true)));
  }

  private _setAuthentication(token: string): boolean {
    this._user.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }
}
