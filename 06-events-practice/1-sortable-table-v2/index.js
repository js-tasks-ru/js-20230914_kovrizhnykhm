export default class SortableTable {
  constructor(headerConfig = [], data = [], { isSortLocally = true } = {}) {
    this.headerConfig = headerConfig;
    this.originalData = Array.isArray(data) ? data : data.data;
    this.data = [...this.originalData];
    this.isSortLocally = isSortLocally;
    this.arrowTemplate = '<span data-element="arrow" class="sortable-table__sort-arrow"></span>';
    this.createTemplate();
  }

  createTemplate() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.getTableTemplate();

    this.subElements = {
      header: this.element.querySelector('.sortable-table__header'),
      body: this.element.querySelector('.sortable-table__body')
    };

    this.subElements.header.addEventListener('pointerdown', this.onHeaderClick.bind(this));

    if (this.isSortLocally) {
      const defaultSortableColumn = this.headerConfig.find(column => column.sortable);
      if (defaultSortableColumn) {
        this.sort(defaultSortableColumn.id, 'asc');
        const defaultHeaderCell = this.subElements.header.querySelector(`[data-id="${defaultSortableColumn.id}"]`);
        defaultHeaderCell.dataset.order = 'asc';

        this.addArrowToColumn(defaultHeaderCell);
      }
    }
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
    const direction = order === 'asc' ? 1 : -1;

    const sortedData = [...this.data];

    sortedData.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (sortType === 'number') {
        return order === 'desc' ? aValue - bValue : bValue - aValue;
      } else if (sortType === 'string') {
        return aValue.localeCompare(bValue, ['ru', 'en'], { caseFirst: 'upper' }) * direction;
      } else if (sortType === 'date') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return (dateA - dateB) * direction;
      }

      return 0;
    });

    this.data = sortedData;
    this.subElements.body.innerHTML = this.getRowsTemplate();
  }

  onHeaderClick(event) {
    const column = event.target.closest('[data-sortable="true"]');
    if (!column) return;

    const { id } = column.dataset;
    const order = column.dataset.order === 'asc' ? 'desc' : 'asc';

    this.subElements.header
      .querySelectorAll('[data-order]')
      .forEach(e => e.removeAttribute('data-order'));

    column.dataset.order = order;
    this.sort(id, order);

    this.addArrowToColumn(column);
  }

  addArrowToColumn(column) {
    if (column) {
      column.innerHTML += this.arrowTemplate;
    }
  }

  destroy() {
    this.element.remove();
  }
}