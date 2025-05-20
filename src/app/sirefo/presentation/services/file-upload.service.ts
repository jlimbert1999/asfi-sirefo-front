import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface uploadedFile {
  originalName: string;
  fileName: string;
}
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/files`;

  constructor() {}

  uploadAsfiNote(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<uploadedFile>(`${this.url}/asfi`, formData);
  }

  getFile(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}
