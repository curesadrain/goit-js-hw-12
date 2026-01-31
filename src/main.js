import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImageByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('input[name="search-text"]');
let query = '';
let currentPage = 1;

searchForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();
  currentPage = 1;
  query = searchInput.value.trim();
  searchInput.value = '';
  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  showLoader();

  try {
    const response = await getImageByQuery(query);
    const images = response.data.hits;
    hideLoader();
    if (images.length === 0) {
      iziToast.info({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    createGallery(images);
    showLoadMoreButton();
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images.',
      position: 'topRight',
    });
    console.error(error);
  }
}

const loadMoreButton = document.querySelector('.load-more-btn');
loadMoreButton.addEventListener('click', onLoadMore);

async function onLoadMore() {
  showLoader();
  try {
    currentPage += 1;
    const cardHeight = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;
    const response = await getImageByQuery(query, currentPage);
    const images = response.data.hits;
    hideLoader();
    if (images.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of Results',
        message:
          "We're sorry, but you've reached the end of the search results.",
        position: 'topRight',
      });
      return;
    }
    createGallery(images);
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching more images.',
      position: 'topRight',
    });
    console.error(error);
  }
}

const cardHeight = document
  .querySelector('.gallery-item')
  .getBoundingClientRect().height;
