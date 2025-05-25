import { asfiRequestStatus } from '../enums/asfi-request-status.enum';

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
  status: asfiRequestStatus;
  file: file;
  circularNumber: string | null;
  dataSheetFile: string;
  circularDate: Date | null;
  processingStatus: string | null;
  sendErrorMessage: string | null;
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
  status: asfiRequestStatus;
  file: file;
  circularNumber: string | null;
  dataSheetFile: string;
  circularDate: Date | null;
  processingStatus: string | null;
  sendErrorMessage: string | null;

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
    this.circularDate = params.circularDate;
    this.processingStatus = params.processingStatus;
    this.sendErrorMessage = params.sendErrorMessage;
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

  extractCorrelative(): number {
    const parts = this.requestCode.split('/');
    const val = Number(parts[parts.length - 2]);
    return isNaN(val) ? 1 : val;
  }

  get statusLabel(): string {
    switch (this.status) {
      case asfiRequestStatus.draft:
        return 'Registrado';

      case asfiRequestStatus.sent:
        return 'Enviado';

      case asfiRequestStatus.accepted:
        return 'Aceptado';

      default:
        return 'Rechazado';
    }
  }
}
