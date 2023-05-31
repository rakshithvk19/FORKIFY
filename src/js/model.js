import { async } from 'regenerator-runtime/runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    results: [],
  },
  bookmarks: [],
};

//Transform recipe data received
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    ...[recipe.key && { key: recipe.key }], //Short-circuiting using '&&' which return the second parameter i.e Object which is then defactored.
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    //Transform recipe data received
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
  // console.log(state.recipe);
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.query = query;
    // console.log(data.data.recipes);
    state.search.results = data.data.recipes.map(res => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        imageUrl: res.image_url,
        ...[res.key && { key: res.key }], //Short-circuiting using '&&' which return the second parameter i.e Object which is then defactored.
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  storeBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  storeBookmarks();
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//Main function to upload recipe.
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => {
        if (entry[0].startsWith('ingredient') && entry[1] !== '') {
          return entry;
        }
      })
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3) {
          throw new Error(
            'Ingredients format not proper! Re-Enter with the proper format'
          );
        } else {
          const [quantity, unit, description] = ingArr;
          return {
            quantity: quantity ? Number(quantity) : null,
            unit,
            description,
          };
        }
      });

    //Converting recipe received from the UI to data model.
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      ingredients: ingredients,
      cooking_time: Number(newRecipe.cookingTime),
      servings: Number(newRecipe.servings),
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    //Push recipe received to the model.
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// clearBookmarks();
