import { DEFAULT_VALIDATOR } from './helpers';

export class Validator {
  constructor({ rules = [], validator = DEFAULT_VALIDATOR }) {
    this.rules = rules;
    this.validator = validator;
  }

  validate(value) {
    return this.validator({ value, rules: this.rules });
  }
}
