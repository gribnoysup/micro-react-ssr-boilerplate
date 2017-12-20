import React from 'react';
import { renderToString } from 'react-dom';

import { App } from './App';

export const html = renderToString(<App />);
