export interface asfiRequestDetailItem {
  item: number;
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

export interface asfiFundTransferDetail {
  item: number;
  maternalLastName: string;
  paternalLastName: string;
  complement: number;
  extension: string;
  documentNumber: string;
  documentType: number;
  supportDocument: string;
  amount: number;
  firstName: string;
  businessName: string;
  supportType: number;
  accountNumber: string;
  accountCurrency: string;
  transferCode: string;
}
