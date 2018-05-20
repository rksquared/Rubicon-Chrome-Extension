import {Page} from './Page';
import {SuggestionNode} from './SuggestionNode';
import {HistoryNode} from './HistoryNode';
import {GraphNode} from './GraphNode';

class GraphLink {
    source: GraphNode;
    target: GraphNode;
    id: number;
}

export {
    GraphLink
}
