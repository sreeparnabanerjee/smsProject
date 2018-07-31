import * as _ from 'lodash';
import * as joi from 'joi';

export class ErrorResponse {
  // noinspection JSUnusedGlobalSymbols
  constructor(
    public reason: string,
    public message?: string
  ) {}
}

export class InternalErrorResponse extends ErrorResponse {
  constructor() {
    super('UNEXPECTED_ERROR', 'Unknown Error');
  }
}

export class InvalidSchemaResponse extends ErrorResponse {
  // noinspection JSUnusedGlobalSymbols
  private constructor(public fields: {[key: string]: string}) {
    super('INVALID_REQUEST_PARAMETERS');
  }

  static fromJoiErrors(errors: joi.ValidationErrorItem[] = []) {
    const joiErrors = {
      'string.email': 'BAD_EMAIL',
      'any.required': 'MISSING_FIELD',
      'any.invalid': 'INVALID_FIELD',
      'string.min': 'MINIMUM_LENGTH_NOT_MET',
      'string.max': 'EXCEEDS_MAX_LENGTH',
      'string.length': 'LENGTH_NOT_EXACT'
    };

    const fields = _(errors).reduce(
      (accumulator, err) => {
        accumulator[err && err.path] = joiErrors[err && err.type];
        return accumulator;
      },
      {}
    );

    return new InvalidSchemaResponse(fields);
  }
}