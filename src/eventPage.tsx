import HistoryGraphNode from './HistoryGraphNode';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';


chrome.tabs.onCreated.addListener((tab) => {
  console.log('opened tab:', tab);
})

chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
  let url = tab.url;
  let title = tab.title;

  console.log('url', url, 'title', title);
})

let nodes: HistoryGraphNode[] = [];
const links: Array<{source: SimulationNodeDatum, target: SimulationNodeDatum}> = [];
console.log('AAAAAAAAA')
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'deleteNode') {
      nodes = request.nodes;
      deleteNode(request.data);
    } else if (request.type === "addNode") {
      nodes = request.nodes;
      addNode(request.data);
    } else if (request.type === "getNodesAndLinks") {
    }
    sendResponse([nodes, links]);
});

function addNode(i: number) {
  const n: HistoryGraphNode = {
      data: {
          name: 'Website ' + i
      },
      index: nodes.length,
      isSuggestion: false,
      next: null,
      suggestions: ['wikipedia.com' + i, 'stackoverflow.com' + i, 'google.com' + i],
      vx: 0,
      vy: 0,
      x: 0,
      y: 0,
  }
  if (nodes.length > 0) {
      const parent = nodes[nodes.length - 1];
      parent.next = n;
      n.x = parent.x + 40
      n.y = parent.y
      links.push({source: nodes[nodes.length - 1], target: n});
  }
  for (let suggestionIndex = 0; suggestionIndex < n.suggestions.length; suggestionIndex++) {
      const suggestion = n.suggestions[suggestionIndex];
      const suggestionNode: HistoryGraphNode = {
          data: {
              name: suggestion
          },
          index: nodes.length,
          isSuggestion: true,
          next: null,
          suggestions: [],
          vx: 0,
          vy: 0,
          x: n.x,
          y: n.y - 20 + 40 * (suggestionIndex % 2),
      }
      nodes.push(suggestionNode);
      links.push({source: n, target: suggestionNode});
  }
  nodes.push(n);
}

function filterInPlace(a, condition) {
  let i = 0, j = 0;

  while (i < a.length) {
    const val = a[i];
    if (condition(val, i, a)) a[j++] = val;
    i++;
  }

  a.length = j;
  return a;
}

function deleteNode(d) {
  let newNodes = nodes.filter(x => x.index !== d.index);
  let newLinks = links.filter(x => x.source.index !== d.index && x.target.index !== d.index);
  for (const suggestion of d.suggestions) {
    newNodes = newNodes.filter((x: any) => x.data.name !== suggestion);
      newLinks = newLinks.filter((x: any) => x.source.data.name !== suggestion && x.target.data.name !== suggestion);
  }
  const parentList = newNodes.filter((x: any) => x.next === d);
  if (parentList.length !== 0) {
      const par: HistoryGraphNode = parentList[0];
      par.next = d.next;
      if (par.next !== null) {
          const newLink: {source: HistoryGraphNode, target: HistoryGraphNode} =
              {source: parentList[0], target: par.next};
          newLinks.push(newLink);
      }
  }
  while (links.length) links.pop();
  for (const l of newLinks) links.push(l);
  while (nodes.length) nodes.pop();
  for (const n of newNodes) nodes.push(n);
}

for (let i = 0; i < 2; i++) {
  addNode(i);
}
