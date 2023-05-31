import View from './view.js';

class addRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was sucessfully uploaded. ;)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  //Using constructor because this code needs to run as soon as object is created and needs nothing from the controller or recipeView
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {
    return ``;
  }
}

export default new addRecipeView();
