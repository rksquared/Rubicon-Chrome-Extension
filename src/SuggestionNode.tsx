import Page from './Page';
import HistoryNode from './HistoryNode';
import GraphLink from './GraphLink';

class SuggestionNode {
    page: Page;
    anchor: HistoryNode;
    isSuggestion: boolean = true;
    id: number;

    constructor(page, anchor, id) {
        this.page = page;
        this.anchor = anchor;
        this.id = id;
    }

    getLink(): GraphLink {
        return {
            source: this.anchor.id,
            target: this.id
        }
    }
}

export default SuggestionNode
