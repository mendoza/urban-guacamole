import { render } from 'react-dom';
import SimpleReactLightbox from 'simple-react-lightbox';
import App from './App';

render(
  <SimpleReactLightbox>
    <App />
  </SimpleReactLightbox>,
  document.getElementById('root')
);
