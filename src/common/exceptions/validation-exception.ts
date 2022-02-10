type ValidationExceptionField = {
  field: string;
  message: string;
}

export class ValidationException extends Error {

  public fields: ValidationExceptionField[];

  constructor(fields: ValidationExceptionField[]) {
    super("Some data was not entered correctly");
    this.fields = fields;
  }

  public toArray(): string[] {
    return this.fields.map(field => `${field.field} ${field.message}`);
  }
}
