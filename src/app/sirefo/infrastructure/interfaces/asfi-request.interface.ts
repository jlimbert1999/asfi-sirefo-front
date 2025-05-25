export interface IAsfiRequest {
  id: string;
  authorityPosition: string;
  requestingAuthority: string;
  requestId: number;
  requestCode: string;
  department: string;
  processType: string;
  quantityDetail: number;
  sentDate: string;
  userName: string;
  createdAt: string;
  status: string;
  file: file;
  circularNumber: string | null;
  dataSheetFile: string;
  circularDate: string | null;
  processingStatus: string | null;
  sendErrorMessage: string | null;
}

interface file {
  originalName: string;
  fileName: string;
}
