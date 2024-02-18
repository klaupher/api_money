export type FieldErrors = {
  [field: string]: string[];
};

export interface IValidatorField<PropsValidated> {
  errors: FieldErrors;
  validatedData: PropsValidated;
  validate(data: any): boolean;
}
