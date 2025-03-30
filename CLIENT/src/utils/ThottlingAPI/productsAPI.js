import axios from 'axios';

let lastCallTime = 0;
const MIN_TIME_BETWEEN_CALLS = 1000;

export const fetchProducts = async () => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;

  if (timeSinceLastCall < MIN_TIME_BETWEEN_CALLS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_TIME_BETWEEN_CALLS - timeSinceLastCall),
    );
  }

  lastCallTime = Date.now();
  return axios.get('/api/products');
};
