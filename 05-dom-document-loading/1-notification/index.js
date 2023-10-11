export default class NotificationMessage {
  static notificationElement = null;

  constructor(message = '', { type = 'success', duration = 2000 } = {}) {
    this.message = message;
    this.type = type;
    this.duration = duration;

    this.render();
  }

  render() {
    if (NotificationMessage.notificationElement) {
      NotificationMessage.notificationElement.remove();
    }

    const element = document.createElement('div');
    element.className = `notification ${this.type}`;
    element.style.setProperty('--value', `${this.duration / 1000}s`);
    element.innerHTML = `
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">${this.message}</div>
      </div>
    `;

    this.element = element;
    NotificationMessage.notificationElement = element;
  }

  show(targetElement = document.body) {
    targetElement.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  destroy() {
    this.remove();
  }
}