import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  IAsfiRequest,
  IDetailRequest,
  AsfiRequestMapper,
  aprovedRequest,
} from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class RetentionService {
  private readonly url = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  ping(message: string) {
    return this.http.post(`${this.url}/ping`, { message });
  }

  searchAprovedCodes(term?: string) {
    const params = new HttpParams({ fromObject: { ...(term && { term }) } });
    return this.http.get<aprovedRequest[]>(`${this.url}/asfi-request/aproved`, {
      params,
    });
  }

  getDetailRequest(id: number, type: 1 | 2 | 4) {
    return this.http.get<IDetailRequest>(
      `${this.url}/consultarEstadoEnvio/${id}/${type}`
    );
  }

  consultarEntidadVigente() {
    return this.http.get(`${this.url}/consultarEntidadVigente`);
  }

  consultarCabacera() {
    return this.http.get(`${this.url}/consultarCabecera`);
  }

  consultarEstadoEnvio(id: string, type: number) {
    return this.http.get(`${this.url}/consultarEstadoEnvio/${id}/${type}`);
  }

  remitirSolicitud(
    form: Object,
    details: any[],
    file: any
  ) {
    return this.http
      .post<IAsfiRequest>(`${this.url}/remitir-solicitud`, {
        ...form,
        file,
        details,
      })
      .pipe(map((resp) => AsfiRequestMapper.fromResponse(resp)));
  }

  updateSolicitud(
    form: Object,
    details: any[],
    file?: any
  ) {
    return this.http
      .post<IAsfiRequest>(`${this.url}/remitir-solicitud`, {
        ...form,
        file,
        details,
      })
      .pipe(map((resp) => AsfiRequestMapper.fromResponse(resp)));
  }

  requestAsfiFundTransfer(
    form: Object,
    details: any[],
    file: any
  ) {
    return this.http.post(`${this.url}/asfi-fund-transfer`, {
      ...form,
      file,
      details,
    });
  }

  consultarListaEstadoEnvio() {
    return this.http.get(`${this.url}/consultarListaEstadoEnvio`);
  }

  uploadAsfiNote(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ originalName: string; fileName: string }>(
      `${this.url}/files/asfi`,
      formData
    );
  }
}
