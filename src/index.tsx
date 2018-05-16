import * as React from 'react';
import * as reactDom from 'react-dom';
import App from './App';
import { GraphData } from './sampleData';

reactDom.render(<App data={GraphData} width={200} height={200} />, document.getElementById('root'));