import axios from 'axios';
const API_KEY = '54439689-be74ec06959a2901216bd7b02';

axios.defaults.baseURL = 'https://pixabay.com/api';

function getImageByQuery(query) {
  return axios.get('/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 21,
    },
  });
}

export { getImageByQuery };
