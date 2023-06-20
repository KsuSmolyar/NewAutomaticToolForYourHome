export class Modal {
  constructor({ scrollDisplay, modalId, btnOpenId = false }) {
    this.scrollDisplay = scrollDisplay;
    this.modalElem = document.getElementById(modalId);
    this.buttonOpen = btnOpenId && document.getElementById(btnOpenId);
    this.focusElements = [
      'a[href]',
      'input',
      'select',
      'textarea',
      'button',
      'iframe',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ];
    this.isOpen = false;
    this.previousActiveElement = false;

    this.events();
  }

  events() {
    if (!this.modalElem) {
      throw new Error(
        'Элемент модального окна modal должен содержать id=modal',
      );
    }

    this.modalContainer = this.modalElem.querySelector('#modalContainer');
    this.modalBackdrop = this.modalElem.querySelector('#modalBackdrop');
    this.buttonClose = this.modalElem.querySelector('#modalButtonClose');

    if (!this.modalContainer) {
      throw new Error(
        'Элемент модального окна modalContainer должен содержать id=modalContainer',
      );
    }
    if (!this.modalBackdrop) {
      throw new Error(
        'Элемент модального окна backdrop должен содержать id=modalBackdrop',
      );
    }
    if (!this.buttonClose) {
      throw new Error(
        'Элемент модального окна buttonClose должен содержать id=modalButtonClose',
      );
    }
    if (this.buttonOpen === null) {
      throw new Error(
        'Не удалось найти элемент по id переданному в btnOpenId',
      );
    }

    if (this.buttonOpen) {
      this.buttonOpen.addEventListener('click', this.open.bind(this));
    }
    this.buttonClose.addEventListener('click', this.close.bind(this));
    this.modalBackdrop.addEventListener('click', this.close.bind(this));

    window.addEventListener('keydown', this.keyBinding.bind(this));
  }

  keyBinding(e) {
    if (e.keyCode === 27 && this.isOpen) {
      this.close();
    }

    if (e.which === 9 && this.isOpen) {
      this.focusCatch(e);
    }
  }

  open() {
    this.previousActiveElement = document.activeElement;
    this.modalElem.classList.add('is-open');
    this.modalContainer.classList.add('fadeInUp');
    this.modalContainer.classList.add('animate-open');

    document.body.style.scrollBehavior = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';

    this.scrollDisplay.disableScroll();

    setTimeout(() => {
      this.isOpen = true;
      this.focusTrap();
    }, 300);
  }

  close() {
    this.modalElem.classList.remove('is-open');
    this.modalContainer.classList.remove('fadeInUp');
    this.modalContainer.classList.remove('animate-open');

    this.scrollDisplay.enableScroll();

    this.isOpen = false;
    this.focusTrap();
  }

  focusCatch(e) {
    const nodes = this.modalContainer.querySelectorAll(this.focusElements);
    const nodesArray = Array.prototype.slice.call(nodes);
    const focusedItemIndex = nodesArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedItemIndex === 0) {
      nodesArray[nodesArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
      nodesArray[0].focus();
      e.preventDefault();
    }
  }

  focusTrap() {
    const nodes = this.modalContainer.querySelectorAll(this.focusElements);
    if (this.isOpen) {
      if (nodes.length) nodes[0].focus();
    } else if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
}
