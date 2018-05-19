import HistoryGraphNode from './HistoryGraphNode';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';



let nodes: HistoryGraphNode[] = [];
let links: Array<{source: SimulationNodeDatum, target: SimulationNodeDatum}> = [];

console.log(nodes);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'deleteNode') {
      nodes = request.nodes;
      links = request.links;
      deleteNode(request.data);
    } else if (request.type === "addNode") {
      nodes = request.nodes;
      links = request.links;
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

function deleteNode(d) {
    console.log(d);
  let newNodes = nodes.filter(x => x.data.name !== d.data.name);
  let newLinks = links.filter((x: any) => x.source.data.name !== d.data.name && x.target.data.name !== d.data.name);
  for (const suggestion of d.suggestions) {
    newNodes = newNodes.filter((x: any) => x.data.name !== suggestion);
      newLinks = newLinks.filter((x: any) => x.source.data.name !== suggestion && x.target.data.name !== suggestion);
  }
  const parentList = newNodes.filter((x: any) => ((x.next !== null) ? x.next.data.name : null) === d.data.name);
  if (parentList.length !== 0) {
      const par: HistoryGraphNode = parentList[0];
      par.next = d.next;
      if (par.next !== null) {
          const newLink: {source: HistoryGraphNode, target: HistoryGraphNode} =
              {source: parentList[0], target: par.next};
          newLinks.push(newLink);
      }
  }
  nodes = newNodes;
  links = newLinks;
}

// for (let i = 0; i < 2; i++) {
//   addNode(i);
// }


function addPageNode(title, suggestions) {
    const n: HistoryGraphNode = {
        data: {
            name: title
        },
        index: nodes.length,
        isSuggestion: false,
        next: null,
        suggestions: suggestions,
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
  


chrome.tabs.onCreated.addListener((tab) => {
    console.log('opened tab:', tab);
})
  
chrome.tabs.onUpdated.addListener((tabId, tabInfo, tab) => {
    let url = tab.url;
    let title = tab.title;

    console.log('url', url, 'title', title);

    if (tabInfo.status !== 'complete') return;

    if (nodes.length === 0 || title !== nodes[nodes.length - 1].data.name) {
        addPageNode(title, [title + ' suggestion 1', title + 'suggestion 2', title + 'suggestion 3'])
    }
})
