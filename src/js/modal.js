export class Modal {
  constructor({ modalId, btnOpenId = false }) {
    this.modalElem = document.getElementById(modalId);
    this.buttonOpen = btnOpenId && document.getElementById(btnOpenId);
    // console.log(this.modalElem, modalId);
    this._focusElements = [
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
    // console.log(this.modalElem);
    if (!this.modalElem) {
      throw new Error(
        'Элемент модального окна modal должен содержать id=modal'
      );
    }

    this.modalContainer = this.modalElem.querySelector('#modalContainer');
    this.modalBackdrop = this.modalElem.querySelector('#modalBackdrop');
    this.buttonClose = this.modalElem.querySelector('#modalButtonClose');

    if (!this.modalContainer) {
      throw new Error(
        'Элемент модального окна modalContainer должен содержать id=modalContainer'
      );
    }
    if (!this.modalBackdrop) {
      throw new Error(
        'Элемент модального окна backdrop должен содержать id=modalBackdrop'
      );
    }
    if (!this.buttonClose) {
      throw new Error(
        'Элемент модального окна buttonClose должен содержать id=modalButtonClose'
      );
    }
    if (this.buttonOpen === null) {
      throw new Error(
        'Элемент модального окна buttonOpen должен содержать id=modalButtonOpen'
      );
    }

    this.buttonOpen &&
      this.buttonOpen.addEventListener('click', this.open.bind(this));
    this.buttonClose.addEventListener('click', this.close.bind(this));
    this.modalBackdrop.addEventListener('click', this.close.bind(this));

    window.addEventListener('keydown', this.keyBinding.bind(this));
  }

  keyBinding(e) {
    if (e.keyCode == 27 && this.isOpen) {
      this.close();
    }

    if (e.which == 9 && this.isOpen) {
      this.focusCatch(e);
      return;
    }
  }

  open() {
    this.previousActiveElement = document.activeElement;
    this.modalElem.classList.add('is-open');
    this.modalContainer.classList.add('fadeInUp');
    this.modalContainer.classList.add('animate-open');

    document.body.style.scrollBehavior = 'auto';
    document.documentElement.style.scrollBehavior = 'auto';

    this.disableScroll();

    setTimeout(() => {
      this.isOpen = true;
      this.focusTrap();
    }, 300);
  }

  close() {
    this.modalElem.classList.remove('is-open');
    this.modalContainer.classList.remove('fadeInUp');
    this.modalContainer.classList.remove('animate-open');

    this.enableScroll();

    this.isOpen = false;
    this.focusTrap();
  }

  focusCatch(e) {
    const nodes = this.modalContainer.querySelectorAll(this._focusElements);
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
    const nodes = this.modalContainer.querySelectorAll(this._focusElements);
    if (this.isOpen) {
      if (nodes.length) nodes[0].focus();
    } else if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  disableScroll() {
    let pagePosition = window.scrollY;
    this.lockPadding();
    document.body.classList.add('disable-scroll');
    document.body.dataset.position = pagePosition;
    document.body.style.top = -pagePosition + 'px';
  }

  enableScroll() {
    let pagePosition = parseInt(document.body.dataset.position, 10);
    this.unlockPadding();
    document.body.style.top = 'auto';
    document.body.classList.remove('disable-scroll');
    window.scrollTo({
      top: pagePosition,
      left: 0,
    });
    document.body.removeAttribute('data-position');
  }

  lockPadding() {
    let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
    document.body.style.paddingRight = paddingOffset;
  }

  unlockPadding() {
    document.body.style.paddingRight = '0px';
  }
}
