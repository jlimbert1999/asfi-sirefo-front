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
  circularNumber: null;
  asfiRequestId: string;
  status: string;
  asfiRequest: asfiRequestProps;
  file: fileProps;
  dataSheetFile: string;
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
  circularNumber: null;
  asfiRequestId: string;
  status: string;
  asfiRequest: asfiRequestProps;
  file: fileProps;
  dataSheetFile: string;

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
  }
}
