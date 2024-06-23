class BaseError {
  private code: any;
  private message: any;
  private detail: any;

  constructor(code: any, message: any, detail?: any) {
    this.code = code;
    this.message = message;
    this.detail = detail;
  }

  setCode = (code: any) => {
    this.code = code;
  };

  setMessage = (message: any) => {
    this.message = message;
  };

  setDetail = (detail: any) => {
    this.detail = detail;
  };

  getCode = () => {
    return this.code;
  };

  getMessage = () => {
    return this.message;
  };

  getDetail = () => {
    return this.detail;
  };
}

export default BaseError;
