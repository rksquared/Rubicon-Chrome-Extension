import HistoryGraphNode from './HistoryGraphNode';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import Page from './Page';
import GraphLink from './GraphLink';
import GraphNode from './GraphNode';
import * as io from 'socket.io-client';
import HistoryGraph from './HistoryGraph';
import axios from 'axios';

const historyGraph = new HistoryGraph();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'deleteNode') {
      historyGraph.deleteNode(request.id);
    } else if (request.type === "getNodesAndLinks") {
        const res = historyGraph.generateGraph();
        console.log(res);
        sendResponse(res);
    } else if (request.type === 'saveHistory') {
        const name = request.name;
        axios.post('http://localhost:3005/api/history', {
            history: name,
            nodes: historyGraph.toJSON()
        })
    } else if (request.type === 'loadHistory') {
        const name = request.name;
        axios.get('http://localhost:3005/api/history', {params: {query: name}})
        .then(res => {
            historyGraph.fromJSON(res.data);
        })
        .catch(err => {
            console.log('ERROR LOADING HISTORY', err);
        })
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    console.log('opened tab:', tab);
})
  
chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
    let url = tab.url;
    let title = tab.title;
    console.log('tabs updated: url', url, 'title', title);
    if (tabInfo.status !== 'complete') return;
    historyGraph.addPage(url, title);
})
