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
  private readonly URL = `${environment.apiUrl}/files`;

  constructor() {}

  uploadAsfiFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<uploadedFile>(`${this.URL}/asfi`, formData);
  }

  getFile(fileUrl: string) {
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

  downloadFileFromUrl(url: string, fileName: string): void {
    this.getFile(url).subscribe({
      next: (blob) => this.downloadBlob(blob, fileName),
    });
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
