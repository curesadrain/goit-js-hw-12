import axios from 'axios';
const API_KEY = '54439689-be74ec06959a2901216bd7b02';

axios.defaults.baseURL = 'https://pixabay.com/api';

async function getImageByQuery(query, page = 1) {
  try {
    const response = await axios.get('/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page: page,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching images from Pixabay API:', error);
    throw error;
  }
}

export { getImageByQuery };
