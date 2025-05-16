import {baseUrl} from './base.url';

export class AuthUrl {
  private static baseUrl = baseUrl + '/auth';

  public static register(): string {
    return this.baseUrl + '/register';
  }
  public static login(): string {
    return this.baseUrl + '/login';
  }

  public static passwordReset(): string {
    return this.baseUrl + '/password-reset';
  }

  public static houses(): string {
    return this.baseUrl + '/houses';
  }
}
