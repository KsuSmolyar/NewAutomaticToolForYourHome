import { DEFAULT_VALIDATOR } from './helpers';

export class Validator {
  constructor(validator = DEFAULT_VALIDATOR) {
    this.validator = validator;
  }

  validate(element) {
    return this.validator(element);
  }
}
