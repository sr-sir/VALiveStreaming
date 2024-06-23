import BaseError from './BaseError';

export default class HttpError extends BaseError {
  private statusCode: any;
  private statusText: any;

  constructor(statusCode: any, statusText: any) {
    super(null, null, null);
    this.statusCode = statusCode;
    this.statusText = statusText;
  }

  setBaseError = (code: any, message: any, detail: any) => {
    this.setCode(code);
    this.setMessage(message);
    this.setDetail(detail);
  };

  setStatusCode = (statusCode: any) => {
    this.statusCode = statusCode;
  };

  setStatusText = (statusText: any) => {
    this.statusText = statusText;
  };

  getStatusCode = () => {
    return this.statusCode;
  };

  getStatusText = () => {
    return this.statusText;
  };
}
