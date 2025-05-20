import { AsfiRequest } from '../../domain';
import { IAsfiRequest } from '../interfaces/asfi-request.interface';

export class AsfiRequestMapper {
  static fromResponse({
    sentDate,
    createdAt,
    ...props
  }: IAsfiRequest): AsfiRequest {
    return new AsfiRequest({
      ...props,
      sentDate: new Date(sentDate),
      createdAt: new Date(createdAt),
    });
  }
}
