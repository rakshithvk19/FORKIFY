import View from './view.js';
import icons from 'url:../../img/icons.svg';

class resultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage =
    'No items found for the search. Please try with a different keyword!';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    const id = window.location.hash.slice(1);

    return `
        <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : ''
            } " href="#${result.id}">
                <figure class="preview__fig">
                    <img src="${result.imageUrl}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    
                </div>
            </a>
        </li>
    `;
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
                <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new resultView();
