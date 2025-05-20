export interface submitRequestDetail {
  item: string;
  maternalLastName: string;
  paternalLastName: string;
  autoConclusion: string;
  complement: number;
  extension: string;
  documentNumber: string;
  documentType: number;
  supportDocument: string;
  amount: number;
  firstName: string;
  businessName: string;
  supportType: number;
}

export interface attachedFile {
  fileName: string;
  originalName: string;
}
