// api/polygon.js
import axios from 'axios';

const PolygonAPI = axios.create({
  baseURL: 'https://api.polygon.io/v2',
  // any other default settings
});

// Add a request interceptor
PolygonAPI.interceptors.request.use((config) => {
  // Do something before request is sent
  // For example, add your API key to the URL
  config.params = config.params || {};
  config.params['apiKey'] = import.meta.env.VITE_POLYGON_API_KEY;
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
PolygonAPI.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default PolygonAPI;