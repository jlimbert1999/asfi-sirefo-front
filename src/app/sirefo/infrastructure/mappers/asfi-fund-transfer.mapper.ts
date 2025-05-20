import { AsfiFundTransfer } from '../../domain';
import { IAsfiFundTransfer } from '../interfaces/asfi-fund-transfer.interface';

export class AsfiFundTransferMapper {
  static fromResponse({
    sentDate,
    createdAt,
    ...props
  }: IAsfiFundTransfer): AsfiFundTransfer {
    return new AsfiFundTransfer({
      ...props,
      sentDate: new Date(sentDate),
      createdAt: new Date(createdAt),
    });
  }
}
