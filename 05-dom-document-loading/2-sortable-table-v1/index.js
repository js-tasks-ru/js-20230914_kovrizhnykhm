export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.createTemplate();
  }

  createTemplate() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.getTableTemplate();

    this.subElements = {
      header: this.element.querySelector('.sortable-table__header'),
      body: this.element.querySelector('.sortable-table__body')
    };

    this.subElements.header.addEventListener('click', this.onHeaderClick.bind(this));
  }

  getTableTemplate() {
    return `
      <div class="sortable-table">
        ${this.getHeaderTemplate()}
        ${this.getBodyTemplate()}
      </div>
    `;
  }

  getHeaderTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(column => this.getHeaderColumnTemplate(column)).join('')}
      </div>
    `;
  }

  getHeaderColumnTemplate({ id, title, sortable }) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>
    `;
  }

  getBodyTemplate() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getRowsTemplate()}
      </div>
    `;
  }

  getRowsTemplate() {
    return this.data.map(item => `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getRowTemplate(item)}
      </a>
    `).join('');
  }

  getRowTemplate(item) {
    return this.headerConfig.map(({ id, template }) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  sort(field, order) {
    const sortType = this.headerConfig.find(column => column.id === field).sortType;
  
    const sortedData = [...this.data];
  
    sortedData.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
  
      if (sortType === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (sortType === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue, ['ru', 'en'], { caseFirst: 'upper' }) : bValue.localeCompare(aValue, ['ru', 'en'], { caseFirst: 'upper' });
      } else if (sortType === 'date') {
        // Здесь будет сортировка по дате
      }
  
      return 0;
    });
  
    this.data = sortedData;
    this.subElements.body.innerHTML = this.getRowsTemplate();
  }

  onHeaderClick(event) {
    const column = event.target.closest('[data-id]');
    if (!column) return;

    const { id, sortable } = column.dataset;
    if (sortable !== 'true') return;

    const order = column.dataset.order === 'asc' ? 'desc' : 'asc';

    this.subElements.header
      .querySelectorAll('[data-order]')
      .forEach(e => e.removeAttribute('data-order'));

    column.dataset.order = order;
    this.sort(id, order);
  }

  destroy() {
    this.element.remove();
  }
}