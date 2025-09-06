import HttpException from "@/exceptions/http-exception";

export default class InvalidSlotTimeFormatException extends HttpException {
  constructor(time: string) {
    super(400, `Định dạng không hợp lệ: ${time}`);
    this.name = "InvalidSlotTimeFormatException";
  }
}
