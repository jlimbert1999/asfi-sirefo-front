import { AsfiRequest, asfiRequestStatus } from '../../domain';
import { IAsfiRequest } from '../interfaces/asfi-request.interface';

export class AsfiRequestMapper {
  static fromResponse({
    sentDate,
    createdAt,
    circularDate,
    status,
    ...props
  }: IAsfiRequest): AsfiRequest {
    return new AsfiRequest({
      ...props,
      status: status as asfiRequestStatus,
      sentDate: new Date(sentDate),
      createdAt: new Date(createdAt),
      circularDate: circularDate ? new Date(circularDate) : null,
    });
  }
}
