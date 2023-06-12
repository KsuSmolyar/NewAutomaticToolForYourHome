import { sendForm } from './api';
import {
  Validator,
  Form,
  required,
  minLength,
  validateEmail,
  stringOnly,
} from './form';
import { Modal } from './modal';

const modalForm = new Modal({
  modalId: 'modal-form',
  btnOpenId: 'modalButtonOpen',
});
const modalPopup = new Modal({ modalId: 'modal-popup' });

const form = new Form({
  formId: 'form',
  fields: [
    {
      name: 'name',
      validator: new Validator({
        rules: [required(), stringOnly(), minLength(2)],
      }),
    },
    {
      name: 'email',
      validator: new Validator({ rules: [required(), validateEmail()] }),
    },
    { name: 'message', validator: null },
  ],
  onSubmit: async (payload) => {
    try {
      await sendForm(payload);
      modalForm.close();
      modalPopup.open();
      form.clear();
    } catch (e) {}
  },
});
