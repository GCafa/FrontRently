import {baseUrl} from './base.url';

export class AuthUrl {
  private static baseUrl = baseUrl + '/auth';

  public static register(): string {
    return this.baseUrl + '/register';
  }
}
