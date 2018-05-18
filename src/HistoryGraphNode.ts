import {SimulationNodeDatum} from 'd3';

class HistoryGraphNode implements SimulationNodeDatum{
    public index: number;
    public isSuggestion: boolean;
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public next: HistoryGraphNode | null;
    public suggestions: string[];
    public data: any;
}

export default HistoryGraphNode
