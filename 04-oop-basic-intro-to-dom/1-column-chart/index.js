export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    value = 0,
    formatHeading = (value) => value,
    link = '',
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
    this.element = this.createElement();
    if (this.data.length === 0) {
      this.element.classList.add('column-chart_loading');
    }
  }

  createLink() {
    return this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : '';
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map((item) => ({
      percent: (item / maxValue * 100).toFixed(0) + '%',
      value: String(Math.floor(item * scale)),
    }));
  }

  createChart() {
    return this.getColumnProps(this.data)
      .map(({ value, percent }) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
      .join('');
  }

  createTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.createLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.createChart()}
          </div>
        </div>
      </div>
    `;
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  update(newData) {
    this.data = newData;
    const chartBody = this.element.querySelector('[data-element="body"]');
    chartBody.innerHTML = this.createChart();
    if (this.data.length === 0) {
      this.element.classList.add('column-chart_loading');
    } else {
      this.element.classList.remove('column-chart_loading');
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}