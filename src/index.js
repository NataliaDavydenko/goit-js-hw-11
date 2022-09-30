const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const imagesGallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';

const params = {
  key: '30285859-60db0152e0f1b0f784a28a816',
  imageType: 'photo',
  orientations: 'horizontal',
  safeSearch: true,
  page: 1,
  per_page: 40,
}

let requestWord = "";
let lightBox = new SimpleLightbox('.gallery a');


searchForm.addEventListener("submit", e => {
    e.preventDefault();
    imagesGallery.innerHTML = '';
    params.page = 1;
    moreBtn.classList.add('is-hidden');
    requestWord = searchForm.searchQuery.value;

    onImageSearch(requestWord);
});


moreBtn.addEventListener('click', clickMoreBtn);

async function onImageSearch(word) {
    try {
        const { data } = await searchImages(word);
        if (data.hits.length === 0) {
            Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again");
            return;
        }
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        createElements(data.hits);
        params.page += 1;
        moreBtn.classList.remove("is-hidden");
        lightBox.refresh();
        quantityHits(data);
    } catch {
        Notiflix.Notify.warning('ERROR. Something went wrong');
    }
}

async function searchImages(word) {
  const res = axios.get(
    `${BASE_URL}/?key=${params.key}&q=${word}&image_type=${params.imageType}&orientation=${params.orientations}&safesearch=${params.safeSearch}&page=${params.page}&per_page=${params.per_page}`
  );
  return res;
}

function createElements(images) {
  const imagesArray = images.map(image => {
    return ` <div class="photo-card">
  <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:<span class="info">${image.likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views:<span class="info">${image.views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments:<span class="info">${image.comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads:<span class="info">${image.downloads}</span></b>
    </p>
  </div>
</div>`
  });
  imagesArray.forEach(imageEl => {
    imagesGallery.insertAdjacentHTML('beforeend', imageEl)
  });
};

async function clickMoreBtn() {
    try {
        const { data } = await searchImages(requestWord);
         createElements(data.hits);
        params.page += 1;
        lightBox.refresh();
        quantityHits(data);
    } catch {
        Notiflix.Notify.warning('ERROR. Something went wrong');
    }
}

function quantityHits(object) {
    const allPhotos = document.querySelectorAll('.photo-card');
        if (allPhotos.length === object.totalHits) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            moreBtn.classList.add('is-hidden');
    }
};