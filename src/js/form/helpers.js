export const DEFAULT_VALIDATOR = ({ value, rules }) => {
  let validationResult = null;
  let i = 0;
  while (validationResult === null && i < rules.length) {
    const res = rules[i](value);
    if (res) {
      validationResult = res;
    }
    i += 1;
  }
  return validationResult;
};

export const required = (message = 'Obligatory field') => (value) => (value ? null : message);

export const minLength = (length, message = `The value cannot be less: ${length}`) => (value) => (value.length >= length ? null : message);

export const validateEmail = (message = 'Please enter a valid email') => (value) => (
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
    .test(value)
    ? null
    : message);

export const stringOnly = (message = 'Latin and Cyrillic characters are allowed') => (value) => (/[^`a-zа-яё ]/iu.test(value) ? message : null);