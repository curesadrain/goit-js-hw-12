import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
let lightbox = null;

function createGallery(images) {
  galleryContainer.innerHTML = images
    .map(
      image => `
    <a class="gallery-item" href="${image.largeImageURL}">
      <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="gallery-info">
        <p class="gallery-info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="gallery-info-item"><b>Views:</b> ${image.views}</p>
        <p class="gallery-info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="gallery-info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </a>
  `
    )
    .join('');

  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
      showCounter: true,
      overlayOpacity: 0.8,
    });
  }
}

export { createGallery };

function clearGallery() {
  galleryContainer.innerHTML = '';
  if (lightbox) {
    lightbox.refresh();
  }
}

export { clearGallery };

const loader = document.querySelector('.loader-container');

function showLoader() {
  loader.classList.remove('is-hidden');
}

export { showLoader };

function hideLoader() {
  loader.classList.add('is-hidden');
}

export { hideLoader };
