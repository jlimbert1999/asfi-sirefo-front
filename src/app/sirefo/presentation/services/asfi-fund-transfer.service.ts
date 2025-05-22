import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs';

import {
  AsfiFundTransferMapper,
  asfiFundTransferItem,
  IAsfiFundTransfer,
} from '../../infrastructure';
import { environment } from '../../../../environments/environment';

interface filterParams {
  limit: number;
  offset: number;
  term: string;
  isAproved?: boolean;
  processType?: string;
  createdAt?: Date;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AsfiFundTransferService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/asfi-fund-transfer`;

  constructor() {}

  create(form: Object, details: asfiFundTransferItem[]) {
    return this.http
      .post<IAsfiFundTransfer>(this.URL, {
        ...form,
        details,
      })
      .pipe(map((resp) => AsfiFundTransferMapper.fromResponse(resp)));
  }

  update(id: string, form: Object, details: asfiFundTransferItem[]) {
    return this.http
      .patch<IAsfiFundTransfer>(`${this.URL}/${id}`, {
        ...form,
        details,
      })
      .pipe(map((resp) => AsfiFundTransferMapper.fromResponse(resp)));
  }

  findAll({ limit, offset, createdAt, isAproved, ...props }: filterParams) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
        ...(createdAt && { createdAt: createdAt.toString() }),
        ...(typeof isAproved === 'boolean' && { isAproved }),
        ...Object.fromEntries(Object.entries(props).filter(([_, v]) => v)),
      },
    });
    return this.http
      .get<{ requests: IAsfiFundTransfer[]; length: number }>(this.URL, {
        params,
      })
      .pipe(
        map((resp) => ({
          length: resp.length,
          requests: resp.requests.map((item) =>
            AsfiFundTransferMapper.fromResponse(item)
          ),
        }))
      );
  }
}
