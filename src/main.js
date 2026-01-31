import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImageByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('input[name="search-text"]');

searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  clearGallery();
  const query = searchInput.value.trim();
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

  getImageByQuery(query)
    .then(response => {
      hideLoader();
      const images = response.data.hits;
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
    })
    .catch(error => {
      hideLoader();
      iziToast.error({
        title: 'Error',
        message: 'An error occurred while fetching images.',
        position: 'topRight',
      });
      console.error(error);
    });
}
