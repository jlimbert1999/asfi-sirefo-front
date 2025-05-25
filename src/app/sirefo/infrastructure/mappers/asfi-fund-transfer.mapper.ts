import { AsfiFundTransfer, asfiRequestStatus } from '../../domain';
import { IAsfiFundTransfer } from '../interfaces/asfi-fund-transfer.interface';

export class AsfiFundTransferMapper {
  static fromResponse({
    sentDate,
    createdAt,
    circularDate,
    status,
    ...props
  }: IAsfiFundTransfer): AsfiFundTransfer {
    return new AsfiFundTransfer({
      ...props,
      status: status as asfiRequestStatus,
      sentDate: new Date(sentDate),
      createdAt: new Date(createdAt),
      circularDate: circularDate ? new Date(circularDate) : null,
    });
  }
}
