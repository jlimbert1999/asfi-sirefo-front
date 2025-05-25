import { asfiRequestStatus } from '../enums/asfi-request-status.enum';

interface asfiFundTransferProps {
  id: string;
  authorityPosition: string;
  requestingAuthority: string;
  requestId: number;
  requestCode: string;
  department: string;
  quantityDetail: number;
  sentDate: Date;
  userName: string;
  createdAt: Date;
  circularNumber: string | null;
  asfiRequestId: string;
  status: asfiRequestStatus;
  asfiRequest: asfiRequestProps;
  file: fileProps;
  dataSheetFile: string;
  circularDate: Date | null;
  processingStatus: string | null;
  sendErrorMessage: string | null;
}
interface asfiRequestProps {
  id: string;
  circularNumber: string;
  requestCode: string;
  quantityDetail: number;
}

interface fileProps {
  originalName: string;
  fileName: string;
}

export class AsfiFundTransfer {
  id: string;
  authorityPosition: string;
  requestingAuthority: string;
  requestId: number;
  requestCode: string;
  department: string;
  quantityDetail: number;
  sentDate: Date;
  userName: string;
  createdAt: Date;
  circularNumber: string | null;
  asfiRequestId: string;
  status: asfiRequestStatus;
  asfiRequest: asfiRequestProps;
  file: fileProps;
  dataSheetFile: string;
  circularDate: Date | null;
  processingStatus: string | null;
  sendErrorMessage: string | null;

  constructor({
    id,
    authorityPosition,
    requestingAuthority,
    requestId,
    requestCode,
    department,
    quantityDetail,
    sentDate,
    userName,
    createdAt,
    circularNumber,
    asfiRequestId,
    status,
    asfiRequest,
    file,
    dataSheetFile,
    circularDate,
    processingStatus,
    sendErrorMessage,
  }: asfiFundTransferProps) {
    this.id = id;
    this.authorityPosition = authorityPosition;
    this.requestingAuthority = requestingAuthority;
    this.requestId = requestId;
    this.requestCode = requestCode;
    this.department = department;
    this.quantityDetail = quantityDetail;
    this.sentDate = sentDate;
    this.userName = userName;
    this.createdAt = createdAt;
    this.circularNumber = circularNumber;
    this.asfiRequestId = asfiRequestId;
    this.status = status;
    this.asfiRequest = asfiRequest;
    this.file = file;
    this.dataSheetFile = dataSheetFile;
    this.circularDate = circularDate;
    this.processingStatus = processingStatus;
    this.sendErrorMessage = sendErrorMessage;
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
