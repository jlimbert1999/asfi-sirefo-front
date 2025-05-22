export interface asfiRequestItem {
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

export interface asfiFundTransferItem {
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
