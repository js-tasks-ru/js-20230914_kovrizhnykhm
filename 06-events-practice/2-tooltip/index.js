class Tooltip {
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = null;
  }
  static instance = null;

  static getInstance() {
    if (!Tooltip.instance) {
      Tooltip.instance = new Tooltip();
    }
    return Tooltip.instance;
  }

  initialize() {
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);
  }

  destroy() {
    this.hideTooltip();
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
  }

  handlePointerOver = (event) => {
    const target = event.target;
    const tooltipText = target.getAttribute('data-tooltip');
    if (tooltipText) {
      this.render(tooltipText, event.clientX, event.clientY);
    }
  }

  handlePointerOut = () => {
    this.hideTooltip();
  }

  render(text, x, y) {
    this.hideTooltip();
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.textContent = text;
    this.element.style.left = x + 'px';
    this.element.style.top = (y + 20) + 'px';
    document.body.appendChild(this.element);
  }

  hideTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default Tooltip;