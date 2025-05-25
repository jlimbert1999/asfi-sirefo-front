import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map, of, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  IAsfiRequest,
  IDetailRequest,
  AsfiRequestMapper,
  aprovedRequest,
  asfiEntities,
} from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class SirefoService {
  private readonly URL = `${environment.apiUrl}/sirefo`;
  private http = inject(HttpClient);

  entities = signal<asfiEntities[]>([]);

  constructor() {}

  ping(message: string) {
    return this.http.post(`${this.URL}/ping`, { message });
  }

  searchAprovedCodes(term?: string) {
    const params = new HttpParams({ fromObject: { ...(term && { term }) } });
    return this.http.get<aprovedRequest[]>(`${this.URL}/asfi-request/aproved`, {
      params,
    });
  }

  getDetailRequest(id: number, type: 1 | 2 | 4) {
    return this.http.get<IDetailRequest>(
      `${this.URL}/consultarEstadoEnvio/${id}/${type}`
    );
  }

  consultarEntidadVigente() {
    return this.entities().length > 0
      ? of(this.entities())
      : this.http
          .get<asfiEntities[]>(`${this.URL}/consultarEntidadVigente`)
          .pipe(tap((data) => this.entities.set(data)));
  }

  consultarCabacera() {
    return this.http.get(`${this.URL}/consultarCabecera`);
  }

  consultarEstadoEnvio(id: string, type: number) {
    return this.http.get(`${this.URL}/consultarEstadoEnvio/${id}/${type}`);
  }

  remitirSolicitud(form: Object, details: any[], file: any) {
    return this.http
      .post<IAsfiRequest>(`${this.URL}/remitir-solicitud`, {
        ...form,
        file,
        details,
      })
      .pipe(map((resp) => AsfiRequestMapper.fromResponse(resp)));
  }

  updateSolicitud(form: Object, details: any[], file?: any) {
    return this.http
      .post<IAsfiRequest>(`${this.URL}/remitir-solicitud`, {
        ...form,
        file,
        details,
      })
      .pipe(map((resp) => AsfiRequestMapper.fromResponse(resp)));
  }

  requestAsfiFundTransfer(form: Object, details: any[], file: any) {
    return this.http.post(`${this.URL}/asfi-fund-transfer`, {
      ...form,
      file,
      details,
    });
  }

  consultarListaEstadoEnvio() {
    return this.http.get(`${this.URL}/consultarListaEstadoEnvio`);
  }

  uploadAsfiNote(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ originalName: string; fileName: string }>(
      `${this.URL}/files/asfi`,
      formData
    );
  }
}
