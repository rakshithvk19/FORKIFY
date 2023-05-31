import View from './view.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const queryRes = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return queryRes;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
