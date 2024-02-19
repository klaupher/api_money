export class BadRequest extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'BadRequest';
  }
}
