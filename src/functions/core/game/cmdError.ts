export default class cmdError {
  message: string;
  type: "argumentError" | "internalError" = "internalError";

  constructor(object: {
    message: string;
    type?: "argumentError" | "internalError";
  }) {
    this.message = object.message;
    this.type = object.type;
  }
}
