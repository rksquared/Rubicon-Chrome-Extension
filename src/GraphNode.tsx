import {Page} from './Page';
import {SuggestionNode} from './SuggestionNode';
import {HistoryNode} from './HistoryNode';

class GraphNode {
    data: HistoryNode | SuggestionNode;
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export {
    GraphNode
}
