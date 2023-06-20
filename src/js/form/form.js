import { Validator } from './validator';

export class Form {
  constructor({ formId, onSubmit, validator }) {
    this.form = document.getElementById(formId);
    this.onSubmit = onSubmit;
    this.validator = validator;
    this.fieldsElements = [];
    this.payload = {};
    this.events();
  }

  events() {
    if (!this.form) {
      throw new Error('Не удалось получить элемент form');
    }
    if (!this.validator || Object.getPrototypeOf(this.validator) !== Validator.prototype) {
      throw new Error('Не передан объект validator или объект validator не является потомком Validator');
    }
    if (!this.onSubmit || typeof this.onSubmit !== 'function') {
      throw new Error(
        'Не передана функция onSubmit или onSubmit не является функцией',
      );
    }

    const formData = new FormData(this.form);

    this.fieldsElements = Array.from(formData.keys()).map((nameEl) => {
      this.form[nameEl].addEventListener('blur', (e) => this.validate.call(this, e.target));
      this.form[nameEl].addEventListener(
        'input',
        this.resetValidation.bind(this),
      );
      return this.form[nameEl];
    });

    this.form.addEventListener('submit', this.submit.bind(this));
  }

  submit(e) {
    e.preventDefault();

    const isValid = this.fieldsElements.every((fieldElement) => {
      if (!this.validate(fieldElement)) {
        fieldElement.focus();
        return false;
      }
      return true;
    });

    if (isValid) {
      this.payload = this.fieldsElements.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {});
      this.onSubmit(this.payload);
    }
  }

  validate(element) {
    const res = this.validator.validate(element);

    if (res) {
      // eslint-disable-next-line no-param-reassign
      element.parentNode.dataset.error = res;
      element.focus();
    }
    return !res;
  }

  resetValidation(e) {
    const element = e.target;
    element.parentNode.removeAttribute('data-error');
  }

  clear() {
    this.form.reset();
  }
}
