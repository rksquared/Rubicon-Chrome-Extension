import GraphNode from './GraphNode';
import HistoryNode from './HistoryNode';
import SuggestionNode from './SuggestionNode';
import GraphLink from './GraphLink';
import Page from './Page';

class HistoryGraph {
    pages: {[url: string]: Page} = {};
    nodes: Array<HistoryNode | SuggestionNode> = [];
    lastHistoryNode: HistoryNode | null = null;
    nextNodeId: number = 0;
    nextLinkId: number = 0;

    constructor() {
    }

    addPage (url, title): void {
        if (this.pages[url] === undefined) {
            this.pages[url] = new Page(url, title);
        }
        const page = this.pages[url];
        const historyNode: HistoryNode = new HistoryNode(page, this.lastHistoryNode, this.nextNodeId);
        this.nextNodeId += 1;
        if (this.lastHistoryNode !== null) {
            this.lastHistoryNode.next = historyNode;
        }
        this.lastHistoryNode = historyNode;
        this.nodes.push(historyNode);
        // add suggestions asynchronously
        for (const url of ['www.google.com', 'www.stackoverflow.com', 'wikipedia.org']) {
            this.addSuggestion(historyNode, url, url);
        }
    }

    addSuggestion(anchor, url, title) {
        if (this.pages[url] === undefined) {
            this.pages[url] = new Page(url, title);
        }
        const page = this.pages[url];
        const suggestionNode: SuggestionNode = new SuggestionNode(page, anchor, this.nextNodeId);
        this.nextNodeId += 1;
        anchor.suggestions.push(suggestionNode);
        this.nodes.push(suggestionNode);
    }

    deleteNode(id: number): void {
        const node: any = this.nodes[id];
        console.log('DELETING', id, node);
        if (node.isSuggestion) {
            const a = node.anchor;
            delete a.suggestions[(a.suggestions.indexOf(node))];
        } else {
            if (node.prev !== null) {
                node.prev.next = node.next;
            }
            if (node.next !== null) {
                node.next.prev = node.prev;
            }
            if (this.lastHistoryNode === node) {
                this.lastHistoryNode = node.prev;
            }
            node.suggestions.forEach(suggestion => {
                delete this.nodes[suggestion.id];
            })
        }
        delete this.nodes[id];
    }

    generateGraph(): {nodes: {[id: string]: GraphNode}, links: GraphLink[]} {
        const links: GraphLink[] = [];
        const nodes: {[id: string]: GraphNode} = {};
        this.nodes.forEach((node: any, i: number) => {
            const link: GraphLink | null = node.getLink();
            if (link !== null) {
                links.push(link);
            }
            nodes[node.id] = {
                data: node.page,
                id: node.id,
                prevId: (node.isSuggestion? null: (node.prev === null? null: node.prev.id)),
                anchorId: node.isSuggestion? node.anchor.id: null,
                isSuggestion: node.isSuggestion,
                x: i * 50 - 25 * (this.nodes.length),
                y: 0,
                vx: 0,
                vy: 0
            }
        })
        return {nodes: nodes, links: links}
    }
}

export default HistoryGraph
