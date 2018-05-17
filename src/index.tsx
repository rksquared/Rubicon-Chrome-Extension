import * as React from 'react';
import * as reactDom from 'react-dom';
import App from './App';
import { GraphData } from './sampleData';

const app = document.createElement('div');
app.id = 'root';

const doc: any = document.body;
doc.append(app);

reactDom.render(<App data={GraphData} width={window.innerWidth} height={200} />, document.getElementById('root'));