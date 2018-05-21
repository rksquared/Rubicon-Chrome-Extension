import SuggestionNode from './SuggestionNode';
import Page from './page';
import {SimulationNodeDatum} from 'd3';

class GraphNode implements SimulationNodeDatum {
    data: Page;
    prevId: number | null;
    anchorId: number | null;
    isSuggestion: boolean;
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export default GraphNode