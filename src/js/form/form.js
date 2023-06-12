import { Validator } from './validator';

export class Form {
  constructor({ formId, fields = [], onSubmit }) {
    this.form = document.getElementById(formId);
    this.fields = fields;
    this.onSubmit = onSubmit;
    this.isValid = false;
    this.fieldsElements = [];
    this.payload = {};
    this.events();
  }

  events() {
    if (!this.form) {
      throw new Error('Не удалось получить элемент form');
    }
    if (
      !this.fields.length
      || !!this.fields.filter(
        (field) => !field.name
          || typeof field.name !== 'string'
          || (field.validator !== null
            && Object.getPrototypeOf(field.validator) !== Validator.prototype),
      ).length
    ) {
      throw new Error(
        'Массив с полями формы не должен быть пустым и объект в массиве должен содержать следующую структуру: {name: "string", validator: Validator | null}',
      );
    }

    if (!this.onSubmit || typeof this.onSubmit !== 'function') {
      throw new Error(
        'Не передана функция onSubmit или onSubmit не является функцией',
      );
    }

    this.fieldsElements = this.fields.map((field) => {
      if (!this.form[field.name]) {
        throw new Error(
          `Не удалось найти элемент формы со значение аттрибута name: ${
            field.name}`,
        );
      }
      this.form[field.name].addEventListener('blur', (e) => this.validate.call(this, e.target, field.validator));
      this.form[field.name].addEventListener(
        'input',
        this.resetValidation.bind(this),
      );
      return this.form[field.name];
    });

    this.form.addEventListener('submit', this.submit.bind(this));
  }

  submit(e) {
    e.preventDefault();
    let i = 0;

    while (this.isValid && this.fieldsElements.length > i) {
      const fieldElement = this.fieldsElements[i];
      const { validator } = this.fields.find(
        (filed) => filed.name === fieldElement.name,
      );
      if (!this.validate(fieldElement, validator)) {
        fieldElement.focus();
      }
      i += 1;
    }

    if (this.isValid) {
      this.payload = this.fieldsElements.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {});
      this.onSubmit(this.payload);
    }
  }

  validate(element, validator) {
    const value = element.value.trim();
    const res = validator && validator.validate(value);
    if (res) {
      // eslint-disable-next-line no-param-reassign
      element.parentNode.dataset.error = res;
      element.focus();
    }
    this.isValid = !res;
    return !res;
  }

  resetValidation(e) {
    const element = e.target;
    element.parentNode.removeAttribute('data-error');
  }

  clear() {
    this.fieldsElements.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.value = '';
    });
  }
}
