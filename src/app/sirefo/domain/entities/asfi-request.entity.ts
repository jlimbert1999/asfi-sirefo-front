interface requestProps {
  id: string;
  authorityPosition: string;
  requestingAuthority: string;
  requestId: number;
  requestCode: string;
  department: string;
  processType: string;
  quantityDetail: number;
  sentDate: Date;
  userName: string;
  createdAt: Date;
  status: string;
  file: file;
  circularNumber: string | null;
  dataSheetFile: string;
}

interface file {
  originalName: string;
  fileName: string;
}

export class AsfiRequest {
  id: string;
  authorityPosition: string;
  requestingAuthority: string;
  requestId: number;
  requestCode: string;
  department: string;
  processType: string;
  quantityDetail: number;
  sentDate: Date;
  userName: string;
  createdAt: Date;
  status: string;
  file: file;
  circularNumber: string | null;
  dataSheetFile: string;

  constructor(params: requestProps) {
    this.id = params.id;
    this.authorityPosition = params.authorityPosition;
    this.requestingAuthority = params.requestingAuthority;
    this.requestId = params.requestId;
    this.requestCode = params.requestCode;
    this.department = params.department;
    this.processType = params.processType;
    this.quantityDetail = params.quantityDetail;
    this.sentDate = params.sentDate;
    this.userName = params.userName;
    this.createdAt = params.createdAt;
    this.status = params.status;
    this.file = params.file;
    this.circularNumber = params.circularNumber;
    this.dataSheetFile = params.dataSheetFile;
  }

  get processTypeLabel(): string {
    switch (this.processType) {
      case 'R':
        return 'Retencion';

      case 'S':
        return 'Suspencion';

      default:
        return 'Desconocido';
    }
  }

  get statusLabel() {
    switch (this.status) {
      case 'pending':
        return 'Pendiente';

      case 'completed':
        return 'Completado';

      default:
        return 'Unknow';
    }
  }
}
