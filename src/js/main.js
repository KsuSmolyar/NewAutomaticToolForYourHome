import { sendForm } from './api';
import {
  Validator,
  Form,
} from './form';
import { Modal } from './modal';
import { ScrollDisplay } from './scrollDisplay';

function ready() {
  const modalForm = new Modal({
    modalId: 'modal-form',
    btnOpenId: 'modalButtonOpen',
    scrollDisplay: ScrollDisplay,
  });
  const modalPopup = new Modal({ modalId: 'modal-popup', scrollDisplay: ScrollDisplay });

  const form = new Form({
    formId: 'form',
    validator: new Validator(),
    onSubmit: async (payload) => {
      try {
        await sendForm(payload);
        modalForm.close();
        modalPopup.open();
        form.clear();
      } catch (e) {
        console.error(e);
      }
    },
  });
}

document.addEventListener('DOMContentLoaded', ready);
