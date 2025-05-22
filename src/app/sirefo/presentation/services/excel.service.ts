import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  // readExcelFile(file: File | Blob): Promise<any[]> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = new Uint8Array(reader.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: 'array' });
  //       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //       const json = XLSX.utils.sheet_to_json(worksheet);
  //       resolve(json);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsArrayBuffer(file);
  //   });
  // }

  readExcelFile(file: File | Blob, requiredColumns?: string[]):Observable<any[]> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = new Uint8Array(reader.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const json: any[] = XLSX.utils.sheet_to_json(worksheet, {
            defval: '',
          });
          if (requiredColumns) {
            const actualColumns = Object.keys(json[0]);
            const missing = requiredColumns.filter( (col) => !actualColumns.includes(col) );
            if (missing.length > 0) {
              observer.error(`El archivo no tiene las columnas requeridas`);
              return;
            }
          }

          observer.next(json);
          observer.complete();
        } catch (err) {
          observer.error('Error procesando el archivo Excel.');
        }
      };

      reader.onerror = () => {
        observer.error('Error leyendo el archivo.');
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
