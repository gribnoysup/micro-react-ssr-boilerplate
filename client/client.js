import React from 'react';
import { render } from 'react-dom';

import { App } from './App';

const main = Component => {
  render(<Component />, document.querySelector('#app'));
};

main(App);

if (module.hot) {
  module.hot.accept('./App.js', () => {
    const { App } = require('./App.js');
    main(App);
  });
}
