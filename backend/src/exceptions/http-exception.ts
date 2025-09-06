export default class HttpException extends Error {
  statusCode: number;
  message: string;
  code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = "HttpException";
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
  }
}
