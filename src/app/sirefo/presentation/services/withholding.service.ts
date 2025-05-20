import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WithholdingService {
  private readonly url = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  ping(message: string) {
    return this.http.post(`${this.url}/ping`, { message });
  }

  consultarEntidadVigente() {
    return this.http.get(`${this.url}/consultarEntidadVigente`);
  }

 
}
