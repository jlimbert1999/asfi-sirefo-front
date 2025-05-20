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
  circularNumber: null;
  asfiRequestId: string;
  status: string;
  asfiRequest: asfiRequest;
  file: file;
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
