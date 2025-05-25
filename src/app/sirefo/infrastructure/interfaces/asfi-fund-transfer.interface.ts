export interface IAsfiFundTransfer {
  id: string;
  authorityPosition: string;
  requestingAuthority: string;
  requestId: number;
  requestCode: string;
  department: string;
  quantityDetail: number;
  sentDate: string;
  userName: string;
  createdAt: string;
  circularNumber: string | null;
  asfiRequestId: string;
  status: string;
  asfiRequest: asfiRequest;
  file: file;
  dataSheetFile: string;
  circularDate: string | null;
  processingStatus: string | null;
  sendErrorMessage: string | null;
}

interface asfiRequest {
  id: string;
  requestCode: string;
  circularNumber: string;
  quantityDetail: number;
}

interface file {
  originalName: string;
  fileName: string;
}
