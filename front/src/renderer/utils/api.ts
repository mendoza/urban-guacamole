import axios from 'axios';

const instance = axios.create({
  baseURL: window.electron.store.get('endpoint'),
  timeout: 120_000,
});

export default instance;
