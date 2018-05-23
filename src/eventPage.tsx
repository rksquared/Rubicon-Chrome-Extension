import HistoryGraphNode from './HistoryGraphNode';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';
import Page from './Page';
import GraphLink from './GraphLink';
import GraphNode from './GraphNode';
import * as io from 'socket.io-client';
import HistoryGraph from './HistoryGraph';
import axios from 'axios';

let historyGraph = new HistoryGraph();
let currentHistory = null;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'deleteNode') {
      historyGraph.deleteNode(request.id);
    } else if (request.type === "getNodesAndLinks") {
        const res = historyGraph.generateGraph();
        sendResponse(res);
    } else if (request.type === 'saveHistory') {
        const name = request.name;
        currentHistory = name;
        
        axios.post('http://localhost:3005/api/history', {
            history: name,
            nodes: historyGraph.toJSON()
        });
        sendResponse(currentHistory);

    } else if (request.type === 'loadHistory') {
        const name = request.name;
        currentHistory = name;
        axios.get('http://localhost:3005/api/history', {params: {query: name}})
        .then(res => {
            currentHistory = name;
            historyGraph = new HistoryGraph();
            historyGraph.fromJSON(res.data);
            sendResponse({ res: 'gotIt' });
        })
        .catch(err => {
            console.log('ERROR LOADING HISTORY', err);
        })

        return true;
    } else if (request.type === 'clearHistory') {
        historyGraph = new HistoryGraph();
        currentHistory = null;
        sendResponse({'clearing': 'clearing'});
    } else if (request.type === 'addPage') {
        const url = request.url;
        const title = request.title;

        axios.get('http://localhost:3005/api/extensionRecs', { params: { link: url } })
        .then(res => {
            const historyNode = historyGraph.addPage(url, title);
            for (const url of res.data) {
                historyGraph.addSuggestion(historyNode, url[1], url[0]);
            }
            historyGraph.pruneRecommendations();
            sendResponse(historyGraph.generateGraph());
        })

        return true;
    } else if (request.type === 'checkHistory') {
        sendResponse({currentHistory}); 
    } else if (request.type === "updateHistory") {
        axios.patch('http://localhost:3005/api/history', { history: request.name, nodes: historyGraph.toJSON() })
        .then(res => {
            console.log(res);
            sendResponse({done: 'done'});
        })
        return true;
    } else if (request.type === 'deleteHistory') {
        axios.delete('http://localhost:3005/api/history', { data: { history: request.name } })
        .then(res => {
            console.log(res);
            sendResponse({done: 'done'});
        })
        return true;
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    console.log('opened tab:', tab);
})
  


// chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
//     let url = tab.url;
//     let title = tab.title;
//     console.log('tabs updated: url', url, 'title', title);
//     if (tabInfo.status !== 'complete') return;
//     historyGraph.addPage(url, title);
// })
