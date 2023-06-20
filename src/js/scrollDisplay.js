export class ScrollDisplay {
  static disableScroll() {
    const pagePosition = window.scrollY;
    this.lockPadding();
    document.body.classList.add('disable-scroll');
    document.body.dataset.position = pagePosition;
    document.body.style.top = `${-pagePosition}px`;
  }

  static enableScroll() {
    const pagePosition = parseInt(document.body.dataset.position, 10);
    this.unlockPadding();
    document.body.style.top = 'auto';
    document.body.classList.remove('disable-scroll');
    window.scrollTo({
      top: pagePosition,
      left: 0,
    });
    document.body.removeAttribute('data-position');
  }

  static lockPadding() {
    const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;
    document.body.style.paddingRight = paddingOffset;
  }

  static unlockPadding() {
    document.body.style.paddingRight = '0px';
  }
}
