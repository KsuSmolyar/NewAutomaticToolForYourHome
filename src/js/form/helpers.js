export const required = (message = 'Obligatory field') => (value) => (value ? null : message);

export const minLength = (length, message = `The value cannot be less: ${length}`) => (value) => (value.length >= length ? null : message);

export const validateEmail = (message = 'Please enter a valid email') => (value) => (
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    .test(value)
    ? null
    : message);

export const stringOnly = (message = 'Latin and Cyrillic characters are allowed') => (value) => (/[^`a-zа-яё ]/iu.test(value) ? message : null);

export const DEFAULT_VALIDATOR = (element) => {
  const dataAttributes = element.dataset;
  const dataAttributesKeys = Object.keys(dataAttributes);
  const value = element.value.trim();

  let validationResult = null;
  let i = 0;
  while (validationResult === null && i < dataAttributesKeys.length) {
    const key = dataAttributesKeys[i];
    let res;
    switch (key) {
      case 'required':
        res = required()(value);
        break;
      case 'minLength':
        res = minLength(dataAttributes[key])(value);
        break;
      case 'stringOnly':
        res = stringOnly()(value);
        break;
      case 'validateEmail':
        res = validateEmail()(value);
        break;
      default:
        res = null;
    }
    if (res) {
      validationResult = res;
    }
    i += 1;
  }
  return validationResult;
};
