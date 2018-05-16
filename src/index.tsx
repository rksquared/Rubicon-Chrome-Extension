import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { GraphData } from './data';

ReactDOM.render(
  <App data={GraphData} height={200} width={100} />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
