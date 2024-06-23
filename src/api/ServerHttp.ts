// import { getAccessToken } from '../authConfig';
import BaseError from '../models/http/BaseError';
import HttpError from '../models/http/HttpError';

class HttpClient {
  static _fetch = async (url: string, method: string, headers = {}, body: any) => {
    const options = this.getOptions(method, headers, body);
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await this.getResContent(response);
      } else {
        const httpError = new HttpError(response.status, response.statusText);
        httpError.setMessage(`HTTP Error, fetch '${url}' failed!`);
        const body = await this.getResContent(response);
        if (body?.errorCode) {
          httpError.setCode(body.errorCode);
          httpError.setDetail(body.error);
        }
        throw httpError;
      }
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      } else {
        const fetchError = new BaseError(null, `Error occurs while fetching '${url}'.`, JSON.stringify(error));
        throw fetchError;
      }
    }
  };

  static getOptions = (method: any, headers: any, body: any): RequestInit => {
    const options: any = {
      method,
      headers,
      cache: 'no-store',
    };
    if (body) {
      options.body = body;
    }
    return options;
  };

  static getResContent = async (response: any) => {
    const resContentType = response.headers.get('Content-Type');
    try {
      if (resContentType.indexOf('application/json') !== -1) {
        const res = await response.json();
        if (res) {
          return res;
        }
      } else if (resContentType.indexOf('application/octet-stream') !== -1) {
        return response.blob();
      } else if (resContentType.indexOf('text/plain') !== -1) {
        const content = await response.text();
        return content;
      }
      return response.body;
    } catch (err) {
      return response.body;
    }
  };
}

class ServerHttp {
  private headers: any;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, access-control-allow-origin',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'If-Modified-Since': 0,
    };
  }

  request = async (url: any, method: any, body: any, headers = this.headers) => {
    try {
      if (method === 'HEAD') {
        return await HttpClient._fetch(url, method, {}, body);
      }
      // const token = await getAccessToken();
      // if (token) {
      //   headers.Authorization = `Bearer ${token}`;
      // }
      const res = await HttpClient._fetch(url, method, headers, body);
      return res;
    } catch (error) {
      let newError = error;
      if (!(error instanceof BaseError)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        newError = new BaseError(null, `Error occurs while fetching '${url}'.`, JSON.stringify(error));
      }
      return null;
    }
  };

  get = async (url: any, body = null) => {
    return await this.request(url, 'GET', body);
  };

  post = async (url: any, body: any, headers = this.headers) => {
    // cannot use application/json content-type
    if (body instanceof FormData) {
      headers = {};
    }
    return await this.request(url, 'POST', body, headers);
  };

  put = async (url: any, body: any, headers = this.headers) => {
    return await this.request(url, 'PUT', body, headers);
  };

  delete = async (url: any, body = null) => {
    return await this.request(url, 'DELETE', body);
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ServerHttp();
