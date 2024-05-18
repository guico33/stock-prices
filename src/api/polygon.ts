// api/polygon.js
import axios from 'axios';

const PolygonAPI = axios.create({
  baseURL: 'https://api.polygon.io/v2',
});

PolygonAPI.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params['apiKey'] = import.meta.env.VITE_POLYGON_API_KEY;
  return config;
});

PolygonAPI.interceptors.response.use((response) => {
  if (response.data.status === 'ERROR') {
    return Promise.reject(response.data);
  }
  return response;
});

export default PolygonAPI;
