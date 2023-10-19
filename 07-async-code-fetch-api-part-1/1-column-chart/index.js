import fetchJson from "./utils/fetch-json.js";
import ColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChartV3 extends ColumnChart {
  constructor({
    url = "",
    range = { from: new Date(), to: new Date() },
    label = "",
    link = "",
    formatHeading = (data) => data,
  } = {}) {
    super({ label, link });
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.formatHeading = formatHeading;
    this.subElements = {
      header: this.element.querySelector('.column-chart__header'),
      body: this.element.querySelector('.column-chart__chart'),
    };
    this.update(this.range.from, this.range.to);
  }

  getHeaderValue(data) {
    return this.formatHeading(
      Object.values(data).reduce((accum, item) => accum + item, 0)
    );
  }

  getRange(from, to) {
    this.range.from = from;
    this.range.to = to;
  }

  async urlData(from, to) {
    this.url.searchParams.set("from", from.toISOString());
    this.url.searchParams.set("to", to.toISOString());
    return fetchJson(this.url);
  }

  async update(from, to) {
    const loadedData = await this.urlData(from, to);
    this.getRange(from, to);

    if (this.data && Object.values(loadedData).length) {
      this.subElements.header.textContent = this.getHeaderValue(loadedData);

      const chartBody = this.subElements.body;
      chartBody.innerHTML = this.getColumnProps(Object.values(loadedData))
        .map(({ value, percent }) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
        .join('');

      this.element.classList.remove("column-chart_loading");
    }
    return loadedData;
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}