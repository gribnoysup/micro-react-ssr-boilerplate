import React from 'react';
import { renderToString } from 'react-dom';

import { App } from './App';

const html = renderToString(<App />);

export default html;