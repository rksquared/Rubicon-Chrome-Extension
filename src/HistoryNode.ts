import Page from './Page';
import SuggestionNode from './SuggestionNode';
import GraphLink from './GraphLink';

class HistoryNode {
    page: Page;
    prev: HistoryNode | null;
    next: HistoryNode | null = null;
    suggestions: SuggestionNode[];
    isSuggestion: boolean = false;
    id: number;

    constructor(page, prev, id) {
        this.page = page;
        this.prev = prev;
        this.id = id;
        this.suggestions = [];
    }

    getLink(): GraphLink | null {
        if (this.prev === null) {
            return null;
        }
        return {
            source: this.prev.id,
            target: this.id
        }
    }
}

export default HistoryNode
