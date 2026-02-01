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
const loadMoreButton = document.querySelector('.load-more-btn');

let query = '';
let currentPage = 1;
let totalHits = 0;
const perPage = 15;

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

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
    totalHits = response.data.totalHits;
    
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

    if (totalHits > perPage) {
      showLoadMoreButton();
    } else if (totalHits > 0) {
      iziToast.info({
        title: 'End of Results',
        message:
          "We're sorry, but you've reached the end of the search results.",
        position: 'topRight',
      });
    }

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

async function onLoadMore() {
  hideLoadMoreButton();
  showLoader();
  
  try {
    currentPage += 1;

    const response = await getImageByQuery(query, currentPage);
    const images = response.data.hits;

    hideLoader();

    if (images.length === 0) {
      iziToast.info({
        title: 'End of Results',
        message:
          "We're sorry, but you've reached the end of the search results.",
        position: 'topRight',
      });
      return;
    }

    createGallery(images);

    const cardHeight = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const loadedImages = currentPage * perPage;
    if (loadedImages < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        title: 'End of Results',
        message:
          "We're sorry, but you've reached the end of the search results.",
        position: 'topRight',
      });
    }

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
