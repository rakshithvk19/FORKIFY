import * as model from './model.js';
import 'regenerator-runtime/runtime';
// import 'core-js/stable';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2
// using publisher subscriber pattern when rendering data or calling view from controller.

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlServings = function (updatedServings) {
  model.updateServings(updatedServings);
  recipeView.render(model.state.recipe);
};

const controlPagination = function (btnGoToPage) {
  resultsView.render(model.getSearchResultsPage(btnGoToPage));
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  bookmarksView.render(model.state.bookmarks);
  recipeView.render(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Render spinner
    addRecipeView.renderSpinner();

    //Upload new recipe data.
    await model.uploadRecipe(newRecipe);
    //Render that recipe
    recipeView.render(model.state.recipe);

    //Render Success Message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Update ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close upload recipe form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (e) {
    addRecipeView.renderError(e.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
